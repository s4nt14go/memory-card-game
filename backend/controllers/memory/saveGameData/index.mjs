import {SaveGameData} from "./SaveGameData.mjs";
import Save from "../../../models/save.mjs";

const controller = new SaveGameData({
  models: {
    Save,
  }
});

export default controller.execute.bind(controller);