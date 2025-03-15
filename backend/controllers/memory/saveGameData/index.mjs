import {SaveGameData} from "./SaveGameData.mjs";
import Save from "../../../models/save.mjs";
import {Authenticate} from "../../../shared/decorators/Authenticate.mjs";

const controller = new SaveGameData({
  models: {
    Save,
  }
});
const authenticated = new Authenticate(controller);

export default authenticated.execute.bind(authenticated);