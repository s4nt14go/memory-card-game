import {ListGames} from "./ListGames.mjs";
import Save from "../../../models/save.mjs";

const controller = new ListGames({
  models: {
    Save,
  }
});

export default controller.execute.bind(controller);