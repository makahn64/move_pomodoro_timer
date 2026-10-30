export function AboutView(): React.JSX.Element {
  return (
    <section className="about">
      <h2 className="about-mark" aria-label="MOVE">
        MO<span>VE</span>
      </h2>
      <p className="about-line">A pomodoro timer where every break is an exercise.</p>
      <dl className="about-facts">
        <dt>Version</dt>
        <dd>{__APP_VERSION__}</dd>
      </dl>
      <p className="about-copy">© 2027 Wine Country Digital</p>
    </section>
  )
}
