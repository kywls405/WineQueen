# WineQueen Development Report

This document condenses the official development completion report submitted for the 23rd Embedded Software Contest. The [original Korean report](WineQueen-development-report.pdf) is included for detailed diagrams, schedules, and test records.

## Project goal

WineQueen automates two operations that conventional wine stoppers leave to the user: sealing an opened bottle under vacuum and releasing the seal for reopening. The prototype was designed to make the process repeatable, visible, and accessible through a single physical or on-screen command.

## System composition

The system separates high-level perception and interface work from deterministic hardware control:

- A Raspberry Pi 5 runs the camera pipeline, YOLO inference, FastAPI server, MJPEG stream, and React interface.
- An Arduino Uno controls the X-Z mechanism, stepper drivers, limit switches, buttons, electromagnet, linear actuator, and vacuum pump.
- HTTP endpoints initiate sealing and opening operations.
- WebSocket messages synchronize physical buttons, process state, and UI navigation.
- Serial messages carry alignment commands and operation acknowledgements between the Raspberry Pi and Arduino.

## Operation flow

### Sealing

1. Accept a seal command from the physical button or web interface.
2. Pick up a stopper with the electromagnet.
3. Move the camera near the bottle's expected position.
4. Detect the bottle opening and iteratively align the X axis.
5. Place the stopper, move the vacuum module into position, and create the seal.
6. Return the mechanism home and notify the interface that the operation is complete.

### Opening

1. Return to the stored bottle position.
2. Grip the stopper with the electromagnet.
3. Release the vacuum and lift the stopper.
4. Return the stopper to its storage position.
5. Reset the system state and return home.

## Engineering challenges

### Reliable button-to-browser delivery

Early tests mixed serial reads, Python event handling, WebSocket broadcasts, and browser callbacks too closely. Intermittent serial input could therefore appear as delayed or duplicated UI events. The final design uses explicit serial message tokens, a dedicated serial-reading thread, a queue for button events, a separate WebSocket broadcaster, and automatic serial reconnection.

### Real-time vision performance

Running inference and streaming on every full-resolution frame caused latency and occasional stream interruptions. The pipeline reduces MJPEG cost, limits inference frequency, and separates camera capture from inference through a bounded frame queue so stale frames can be discarded.

### Vacuum seal geometry

The first vacuum-module geometry did not maintain a stable seal after being attached to the stopper. Testing showed that both nozzle leakage and force concentration at a narrow contact area contributed to the failure. The nozzle and stopper interface were redesigned with a wider contact surface and improved physical sealing.

### Stepper-driver current capacity

The initial A4988 driver could not provide enough current for the selected stepper motor under load. The hardware was revised around a TB6600 driver, providing additional current capacity and accessible current limiting through its physical switch settings.

## Distinguishing features

- Fully automated sealing and opening rather than manual pumping.
- Repeatable motion and vacuum timing instead of user-dependent force.
- Live process visibility through the device display and MJPEG stream.
- A modular split between perception, web control, serial communication, and hardware state machines.
- A path toward multi-bottle handling and smart storage notifications.

## Project artifacts

- [Development demonstration video](https://www.youtube.com/watch?v=y1499OYCkKM)
- [Original development completion report](WineQueen-development-report.pdf)
- [Backend implementation](../backend/main.py)
- [Embedded controller firmware](../embedded/WINEQUEEN_HW.ino)
- [Frontend implementation](../frontend/src)
