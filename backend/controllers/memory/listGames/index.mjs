import {ListGames} from "./ListGames.mjs";
import Save from "../../../models/save.mjs";
import {Authenticate} from "../../../shared/decorators/Authenticate.mjs";

const controller = new ListGames({
  models: {
    Save,
  }
});

const authenticated = new Authenticate(controller);

export default authenticated.execute.bind(authenticated);