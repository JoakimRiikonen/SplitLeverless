# Split leverless controller

![image of the controller](https://github.com/user-attachments/assets/de8bbbc6-decb-4254-b3ec-38508ae9a0e2)

## Description

This is a DIY version of a leverless controller that is split in two halves for more comfort. The case is made to be 3D-printable and the electronics consist of a Raspberry Pi Pico running GP2040-CE, Kailh Choc V2 low profile switches, a couple 6mm buttons,  a small screen, and an RJ45/Ethernet cable to connect the two halves.

The models for the case are available under the models folder. The case was modeled using Replicad (https://replicad.xyz/) which is a Javascript wrapper around OpenCascade. The models are free to use and modify, so in case you wish to change or fix something, feel free to do so.

## Build instructions

### Requirements

+ Soldering equipment (soldering iron, solder, wires, etc.)
+ Access to a 3D printer

### Build steps

1. Acquire all the required materials or equivalent alternatives. The list of required materials is listed in the bill of materials
2. Print the case. PLA works fine but you can use fancier filaments if you want. IMPORTANT NOTE: The cases connect together via M3 bolts, and the nuts are embedded inside the upper halves of the prints. A pause must be added in the print in order to embed the nut inside.
3. Install the GP2040-CE into the Raspberry Pi Pico. The instructions are available on GP2040 website: https://gp2040-ce.info/introduction
4. Glue the keycaps and the 6mm buttons into place, the keycaps are inserted from the top while the 6mm buttons are inserted from the bottom. Gluing the 6mm buttons can be a pain since they are so small.
5. Solder everything into the Raspberry Pi according to the pinout: https://gp2040-ce.info/controller-build/wiring/. For the RJ45 connection between the halves, make sure that the arrangement of the pins is the same on both sides. 7 of the wires should be used for buttons and 1 should be used for ground. For the USB-C connection, wire the USB-C ground to the TP1 pin, USB-C data- to TP2 and USB-C data+ to TP3. A bit hacky but it works, there should be screenshots of people doing this online if the instructions are confusing.
6. Jam all of the wiring into the case, close it, and test that everything works.

When building this, I recommend building the right side first and checking that it works properly before starting the left one in case any issues come up.


## Thoughts

The build is far from perfect but it has worked for me well for over six months so far. Here is a quick list of pros and cons, and also some things to improve in case there is a next version.

### Good things
+ It works
+ Much more comfortable to use than a typical small leverless controller
+ Feel sturdy even though it is 3D printed.
+ Looks quite nice (at least in my opinion)

### Not-so-good things
+ The case is quite thick. This is mainly due to the thickness of the RJ45 port,so there's really no way to make it slimmer without changing the way the halves are connected.
+ Gluing the 6mm buttons into place can be a major pain. I had multiple buttons jam due to the glue seeping inside the button while gluing them into place.
+ The 3D print requires a pause to embed the M3 nuts inside. I could've used heat-set inserts instead, but installing them is annoying as well and I wanted to use parts that would be most easily available.
+ Wiring everything together can be finnicky, especially since you have to be careful of not ruining the case. A hot soldering iron melts through PLA quite fast.
+ The pegs for the screen and the Raspberry Pi are too slim and break off easily. Not a big problem though, glue still holds everything in place firmly

### Things to improve (if there ever is a next version)

+ Swapping out the RJ45 port for something slimmer would be nice. Ideally the new port/cable would still be 8+ cables running between the halves so that wiring is easy and communication between the halves wouldn't require I2C or something similar.
+ Maybe the entire controller could just be made into a PCB. That way there would be no need to solder any wires and perhaps the PCBs could arrive fully assembled apart from the key switches. I would have to learn PCB design before that, though.
+ Fix the pegs

## Inspired by
+ Open-source split keyboads such as the Ferris Sweep (https://github.com/davidphilipbarr/Sweep)
+ Splitbox by UltraDavid, another splittable controller (https://www.printables.com/model/513335-splitbox-the-splittable-fighting-game-controller-a)
