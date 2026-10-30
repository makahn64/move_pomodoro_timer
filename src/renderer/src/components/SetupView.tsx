import { useState } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Plus, Trash2, X } from 'lucide-react'
import type { AppData, Exercise, SequenceEntry } from '../../../shared/types'
import { minutes } from '../format'
import { NumberField } from './NumberField'

interface Props {
  data: AppData
  update: (fn: (d: AppData) => AppData) => void
}

const LIB = 'lib:'
const SEQUENCE = 'sequence'

export function SetupView({ data, update }: Props): React.JSX.Element {
  const [dragging, setDragging] = useState<string | null>(null)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )
  const byId = new Map(data.exercises.map((e) => [e.id, e]))
  const work = data.settings.workMinutes

  const append = (exerciseId: string, at?: number): void =>
    update((d) => {
      const sequence = [...d.sequence]
      sequence.splice(at ?? sequence.length, 0, { key: crypto.randomUUID(), exerciseId })
      return { ...d, sequence }
    })

  const onDragStart = (e: DragStartEvent): void => setDragging(String(e.active.id))

  const onDragEnd = ({ active, over }: DragEndEvent): void => {
    setDragging(null)
    if (!over) return
    const id = String(active.id)
    const overId = String(over.id)
    const overIndex = data.sequence.findIndex((s) => s.key === overId)
    if (id.startsWith(LIB)) {
      append(id.slice(LIB.length), overIndex === -1 ? undefined : overIndex)
      return
    }
    if (id === overId) return
    update((d) => {
      const from = d.sequence.findIndex((s) => s.key === id)
      const to =
        overId === SEQUENCE ? d.sequence.length - 1 : d.sequence.findIndex((s) => s.key === overId)
      if (from === -1 || to === -1) return d
      return { ...d, sequence: arrayMove(d.sequence, from, to) }
    })
  }

  const draggingExercise = dragging
    ? byId.get(
        dragging.startsWith(LIB)
          ? dragging.slice(LIB.length)
          : (data.sequence.find((s) => s.key === dragging)?.exerciseId ?? '')
      )
    : undefined

  const steps = data.sequence.filter((s) => byId.has(s.exerciseId))
  const longest = Math.max(1, ...steps.map((s) => work + byId.get(s.exerciseId)!.minutes))
  const total = steps.reduce((sum, s) => sum + work + byId.get(s.exerciseId)!.minutes, 0)

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragCancel={() => setDragging(null)}
    >
      <div className="setup">
        <section className="panel" aria-labelledby="lib-title">
          <header className="panel-head">
            <h2 id="lib-title">Exercises</h2>
            <p className="panel-sub">Drag one into your sequence, or press +</p>
          </header>
          <AddExercise data={data} update={update} />
          <ul className="lib-list">
            {data.exercises.map((ex) => (
              <LibraryItem
                key={ex.id}
                exercise={ex}
                uses={data.sequence.filter((s) => s.exerciseId === ex.id).length}
                update={update}
                onAppend={() => append(ex.id)}
              />
            ))}
          </ul>
          {data.exercises.length === 0 && (
            <p className="empty">No exercises yet. Add your first one above.</p>
          )}
        </section>

        <SequencePanel count={steps.length} total={total}>
          <SortableContext
            items={data.sequence.map((s) => s.key)}
            strategy={verticalListSortingStrategy}
          >
            <ol className="seq-list">
              {data.sequence.map((entry, i) => {
                const ex = byId.get(entry.exerciseId)
                if (!ex) return null
                return (
                  <SequenceItem
                    key={entry.key}
                    entry={entry}
                    position={i + 1}
                    exercise={ex}
                    work={work}
                    longest={longest}
                    onRemove={() =>
                      update((d) => ({
                        ...d,
                        sequence: d.sequence.filter((s) => s.key !== entry.key)
                      }))
                    }
                  />
                )
              })}
            </ol>
          </SortableContext>
        </SequencePanel>
      </div>
      <DragOverlay dropAnimation={null}>
        {draggingExercise && (
          <div className="drag-chip">
            <GripVertical size={16} aria-hidden /> {draggingExercise.name}
            <span className="drag-chip-min">{minutes(draggingExercise.minutes)}</span>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}

function AddExercise({ data, update }: Props): React.JSX.Element {
  const [name, setName] = useState('')
  const [mins, setMins] = useState<number>(data.settings.defaultExerciseMinutes)

  const add = (e: React.FormEvent): void => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    update((d) => ({
      ...d,
      exercises: [...d.exercises, { id: crypto.randomUUID(), name: trimmed, minutes: mins }]
    }))
    setName('')
    setMins(data.settings.defaultExerciseMinutes)
  }

  return (
    <form className="add-form" onSubmit={add}>
      <label className="field field-grow">
        <span className="field-label">New exercise</span>
        <input
          className="input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Shoulder rolls"
          maxLength={60}
        />
      </label>
      <label className="field">
        <span className="field-label">Minutes</span>
        <NumberField
          className="input input-num"
          value={mins}
          min={1}
          max={120}
          onCommit={setMins}
        />
      </label>
      <button
        className="btn btn-primary"
        data-tone="exercise"
        type="submit"
        disabled={!name.trim()}
      >
        <Plus size={16} strokeWidth={2.75} aria-hidden /> Add
      </button>
    </form>
  )
}

interface LibraryItemProps {
  exercise: Exercise
  uses: number
  update: Props['update']
  onAppend: () => void
}

function LibraryItem({ exercise, uses, update, onAppend }: LibraryItemProps): React.JSX.Element {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: LIB + exercise.id })
  const [name, setName] = useState(exercise.name)
  const [confirming, setConfirming] = useState(false)

  const patch = (p: Partial<Exercise>): void =>
    update((d) => ({
      ...d,
      exercises: d.exercises.map((e) => (e.id === exercise.id ? { ...e, ...p } : e))
    }))

  const remove = (): void =>
    update((d) => ({
      ...d,
      exercises: d.exercises.filter((e) => e.id !== exercise.id),
      sequence: d.sequence.filter((s) => s.exerciseId !== exercise.id)
    }))

  const commitName = (): void => {
    const trimmed = name.trim()
    if (trimmed && trimmed !== exercise.name) patch({ name: trimmed })
    else setName(exercise.name)
  }

  if (confirming) {
    return (
      <li className="lib-item lib-item-confirm">
        <span>
          Delete <strong>{exercise.name}</strong>? It’s in your sequence{' '}
          {uses === 1 ? 'once' : `${uses} times`} and will be removed from it.
        </span>
        <span className="confirm-actions">
          <button className="btn btn-danger btn-small" onClick={remove}>
            Delete
          </button>
          <button className="btn btn-line btn-small" onClick={() => setConfirming(false)}>
            Keep
          </button>
        </span>
      </li>
    )
  }

  return (
    <li ref={setNodeRef} className="lib-item" data-dragging={isDragging || undefined}>
      <button
        className="grip"
        {...listeners}
        {...attributes}
        aria-label={`Drag ${exercise.name} into the sequence`}
      >
        <GripVertical size={18} aria-hidden />
      </button>
      <input
        className="input input-quiet"
        value={name}
        aria-label="Exercise name"
        maxLength={60}
        onChange={(e) => setName(e.target.value)}
        onBlur={commitName}
        onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
      />
      <span className="min-field">
        <NumberField
          className="input input-quiet input-num"
          value={exercise.minutes}
          min={1}
          max={120}
          aria-label={`${exercise.name} minutes`}
          onCommit={(minutes) => patch({ minutes })}
        />
        <span className="unit">min</span>
      </span>
      <button className="icon-btn" onClick={onAppend} title="Add to end of sequence">
        <Plus size={18} strokeWidth={2.5} aria-hidden />
        <span className="sr-only">Add {exercise.name} to end of sequence</span>
      </button>
      <button
        className="icon-btn icon-btn-danger"
        onClick={() => (uses ? setConfirming(true) : remove())}
        title="Delete exercise"
      >
        <Trash2 size={17} aria-hidden />
        <span className="sr-only">Delete {exercise.name}</span>
      </button>
    </li>
  )
}

function SequencePanel({
  count,
  total,
  children
}: {
  count: number
  total: number
  children: React.ReactNode
}): React.JSX.Element {
  const { setNodeRef, isOver } = useDroppable({ id: SEQUENCE })
  return (
    <section
      ref={setNodeRef}
      className="panel panel-sequence"
      data-over={isOver || undefined}
      aria-labelledby="seq-title"
    >
      <header className="panel-head">
        <h2 id="seq-title">Sequence</h2>
        <p className="panel-sub">
          {count
            ? `${count} rounds of work then exercise · ${minutes(total)} in all`
            : 'Runs top to bottom'}
        </p>
      </header>
      {children}
      {count === 0 && (
        <p className="empty seq-empty">Drag exercises here to build your sequence.</p>
      )}
    </section>
  )
}

interface SequenceItemProps {
  entry: SequenceEntry
  position: number
  exercise: Exercise
  work: number
  longest: number
  onRemove: () => void
}

function SequenceItem({
  entry,
  position,
  exercise,
  work,
  longest,
  onRemove
}: SequenceItemProps): React.JSX.Element {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: entry.key
  })
  const style = { transform: CSS.Transform.toString(transform), transition }
  return (
    <li ref={setNodeRef} style={style} className="seq-item" data-dragging={isDragging || undefined}>
      <button
        className="grip"
        {...listeners}
        {...attributes}
        aria-label={`Reorder ${exercise.name}, step ${position}`}
      >
        <GripVertical size={18} aria-hidden />
      </button>
      <span className="seq-pos">{position}</span>
      <div className="seq-body">
        <div className="seq-text">
          <span className="seq-name">{exercise.name}</span>
          <span className="seq-mins">
            {work} + {exercise.minutes} min
          </span>
        </div>
        {/* Each segment's length is its duration, so the list reads as a time score. */}
        <div className="score" aria-hidden>
          <span className="score-work" style={{ width: `${(work / longest) * 100}%` }} />
          <span className="score-ex" style={{ width: `${(exercise.minutes / longest) * 100}%` }} />
        </div>
      </div>
      <button className="icon-btn" onClick={onRemove} title="Remove from sequence">
        <X size={18} strokeWidth={2.5} aria-hidden />
        <span className="sr-only">
          Remove {exercise.name} from step {position}
        </span>
      </button>
    </li>
  )
}
