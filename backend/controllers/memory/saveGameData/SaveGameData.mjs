import {N0} from "../../../shared/core/N0.mjs";
import {isMongoId, Status} from "../../../shared/project/utils.mjs";
import {formatErrors, InvalidUserId} from "../../../shared/project/Errors.mjs";
import {ISODate} from "../../../shared/core/ISODate.mjs";
import {
  CompletedIsRequired,
  DifficultyIsRequired,
  InvalidCompletedField,
  InvalidDifficultyField
} from "./SaveGameDataErrors.mjs";

export const difficultyOptions = ['Easy', 'Normal', 'Hard'];
export const possibleCompleted = [0, 1];

export class SaveGameData {

  constructor({ models: { Save } }) {
  // constructor(Save) {
  // constructor(args) {
    // const { models } = args;
    // this.Save = args;
    this.Save = Save;
  }

  async executeImpl({
    userID,
    gameDate: _gameDate,
    difficulty,
    failed: _failed,
    completed,
    timeTaken: _timeTaken,
  }) {

    // region ------------------------- Validate input ----------------------
    const errors = [];

    if (!isMongoId(userID)) {
      errors.push(new InvalidUserId().setField('userID'));
    }

    const gameDateOrErrors = ISODate.create(_gameDate);
    if (gameDateOrErrors.isFailure)
      for (const e of gameDateOrErrors.errors)
        errors.push(e.setField('gameDate'));

    if (!difficulty)
      errors.push(new DifficultyIsRequired().setField('difficulty'));
    else if (!difficultyOptions.includes(difficulty))
      errors.push(new InvalidDifficultyField().setField('difficulty'));

    const failedOrErrors = N0.create(_failed);
    if (failedOrErrors.isFailure)
      for (const e of failedOrErrors.errors)
        errors.push(e.setField('failed'));

    if (completed === undefined || completed === null)
      errors.push(new CompletedIsRequired().setField('completed'));
    else if (!possibleCompleted.includes(completed))
      errors.push(new InvalidCompletedField().setField('completed'));

    const timeTakenOrErrors = N0.create(_timeTaken);
    if (timeTakenOrErrors.isFailure)
      for (const e of timeTakenOrErrors.errors)
        errors.push(e.setField('timeTaken'));

    if (errors.length)
      return formatErrors(errors);
    // endregion ------------------------------------------------------------

    const gameDate = gameDateOrErrors.value.value;
    const failed = failedOrErrors.value.value;
    const timeTaken = timeTakenOrErrors.value.value;

    console.log({gameDate, failed, timeTaken, difficulty, completed});

    const newSave = new this.Save({
      userID,
      gameDate,
      failed,
      difficulty,
      completed,
      timeTaken,
    });

    await newSave.save();

    return {
      status: Status.CREATED,
    };
  }

  async execute(req, res) {

    try {
      const { userID, gameDate, failed, difficulty, completed, timeTaken } = req.body;

      const impl = await this.executeImpl({
        userID,
        gameDate,
        failed,
        difficulty,
        completed,
        timeTaken,
      });

      const { status, result } = impl;
      res.status(status).json(result);

    } catch (error) {
      console.error('Error saving game data:', error);
      res.status(500).json({message: 'Error saving game data', error});
    }
  }
}