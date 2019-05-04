import {ICanReceiveInput, IPlayerKeyboardEvent, IPlayerMouseClickEvent} from "./types";
import {Text, UserInterface} from "./UserInterface";

export class MenuComponent implements ICanReceiveInput {
  private onOpen: (ui: UserInterface) => void;
  private onClose: () => void;
  private redraw: () => void;
  private isOpen = false;

  constructor(onOpen: (ui: UserInterface) => void, onClose: () => void, redraw: () => void) {
    this.onOpen = onOpen;
    this.onClose = onClose;
    this.redraw = redraw;
  }

  onInput(event: IPlayerMouseClickEvent | IPlayerKeyboardEvent): void {
    console.log(event)
    if (event.type === "keypressed" && event.keyname === "menu") {
      if (this.isOpen) {
        console.log("close")
        this.isOpen = false;
        this.onClose()
        this.redraw();
      } else {
        console.log("open")
        this.isOpen = true;
        this.onOpen(UserInterface.fromComponents([{
          render: new Text('menu', 'black', 1000)
        }]));
        this.redraw();
      }
    }
  }
}