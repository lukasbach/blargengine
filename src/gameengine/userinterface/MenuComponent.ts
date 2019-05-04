import {ICanReceiveInput, IPlayerKeyboardEvent, IPlayerMouseClickEvent} from "../types";
import {UserInterface, Text} from "./UserInterface";
import {Renderable} from "../Renderable";

type IMenuEntry = IMenuButton | IMenuHeading;

interface IMenuButton {
  buttonText: string;
  onAction: () => void;
}

interface IMenuHeading {
  heading: string;
}

export class MenuComponent implements ICanReceiveInput {
  private onOpen: (ui: UserInterface) => void;
  private onClose: () => void;
  private redraw: () => void;
  private isOpen = false;
  private entries: IMenuEntry[] = [
    { heading: 'heading' },
    { buttonText: 'button one', onAction: () => console.log(1) },
    { buttonText: 'button two', onAction: () => console.log(2) },
    { buttonText: 'button three', onAction: () => console.log(3) },
    { heading: 'heading other' },
    { buttonText: 'button one', onAction: () => console.log(1) },
    { buttonText: 'button two', onAction: () => console.log(2) },
  ]

  constructor(onOpen: (ui: UserInterface) => void, onClose: () => void, redraw: () => void) {
    this.onOpen = onOpen;
    this.onClose = onClose;
    this.redraw = redraw;
  }

  onInput(event: IPlayerMouseClickEvent | IPlayerKeyboardEvent): void {
    if (event.type === "keypressed" && event.keyname === "menu") {
      if (this.isOpen) {
        this.isOpen = false;
        this.onClose();
        this.redraw();
      } else {
        this.isOpen = true;
        this.onOpen(UserInterface.fromComponents([{
          render: new Text('menu', 'black', 1000)
        }]));
        this.redraw();
      }
    }
  }

  private constructMenu(): UserInterface {
    const renderables: Renderable[] = [];

    this.entries.map(e => {
      const asHeading = (e as IMenuHeading);
      const asButton = (e as IMenuButton);

      if (!!asHeading.heading) {
        return // TODO
      }
    })

    return UserInterface.fromComponents(renderables.map(render => ({ render })))
  }
}