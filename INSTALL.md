# Installing MOVE

MOVE is free and isn't registered with Apple or Microsoft, so the first time you open it your computer will warn you that it doesn't recognise the developer. You only have to get past this once.

## Mac

1. Open `MOVE-1.1.0.dmg` and drag **MOVE** into **Applications**.
2. Open MOVE from Applications. macOS says it can't verify the app. Click **Done** (not "Move to Trash").
3. Open **System Settings → Privacy & Security** and scroll down. Next to "MOVE was blocked", click **Open Anyway**.
4. Confirm with your password or Touch ID. MOVE opens, and from now on it opens normally.

## Windows

1. Run `MOVE-1.1.0-setup.exe`.
2. If a blue "Windows protected your PC" box appears, click **More info**, then **Run anyway**.
3. MOVE installs and opens. It adds a shortcut to your desktop and Start menu.

## Linux

1. Download `MOVE-1.1.0.AppImage`.
2. Right-click it → **Properties** → **Permissions** → tick **Allow executing file as program**. (Or run `chmod +x MOVE-1.1.0.AppImage`.)
3. Double-click it to open.

If it doesn't open on Ubuntu 22.04 or newer, install FUSE once with `sudo apt install libfuse2`.

## Where your exercises are saved

Your exercises, sequence and settings are saved on your computer and are still there after you quit:

- Mac: `~/Library/Application Support/MOVE/move-data.json`
- Windows: `%APPDATA%\MOVE\move-data.json`
- Linux: `~/.config/MOVE/move-data.json`
