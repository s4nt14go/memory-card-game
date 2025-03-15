import {isMongoId, Status} from "../../../shared/project/utils.mjs";
import {PositiveInteger} from "../../../shared/core/PositiveInteger.mjs";
import {SortFieldIsRequired, InvalidSortField, SortDirIsRequired, InvalidSortDir} from "./ListGamesErrors.mjs";
import {formatErrors, InvalidUserId} from "../../../shared/project/Errors.mjs";

export const sortFieldOptions = ['gameDate', 'failed', 'difficulty', 'completed', 'timeTaken'];
export const sortDirOptions = {
  asc: 1,
  desc: -1,
};

export class ListGames {

  constructor({ models: { Save } }) {
    this.Save = Save;
  }

  async executeImpl({
    userID,
    pageNumber: _pageNumber,
    pageSize: _pageSize,
    sortField,
    sortDir: _sortDir,
  }) {

    // region ------------------------- Validate input ----------------------
    const errors = [];

    if (!isMongoId(userID)) {
      errors.push(new InvalidUserId().setField('userID'));
    }

    const pageSizeOrErrors = PositiveInteger.create(_pageSize);
    if (pageSizeOrErrors.isFailure)
      for (const e of pageSizeOrErrors.errors)
        errors.push(e.setField('pageSize'));

    const pageNumberOrErrors = PositiveInteger.create(_pageNumber);
    if (pageNumberOrErrors.isFailure)
      for (const e of pageNumberOrErrors.errors)
        errors.push(e.setField('pageNumber'));

    if (!sortField)
      errors.push(new SortFieldIsRequired().setField('sortField'));
    else if (!sortFieldOptions.includes(sortField))
      errors.push(new InvalidSortField().setField('sortField'));

    if (!_sortDir)
      errors.push(new SortDirIsRequired().setField('sortDir'));
    else if (!Object.keys(sortDirOptions).includes(_sortDir))
      errors.push(new InvalidSortDir().setField('sortDir'));

    if (errors.length)
      return formatErrors(errors);
    // endregion ------------------------------------------------------------

    const pageSize = pageSizeOrErrors.value.value;
    const pageNumber = pageNumberOrErrors.value.value;
    const sortDir = sortDirOptions[_sortDir];
    console.log({pageSize, pageNumber, sortField, sortDir});

    const games = await this.Save.find({userID})
      .skip(pageSize * (pageNumber - 1))
      .limit(pageSize)
      .sort({[sortField]: sortDir});

    return {
      status: Status.OK,
      result: {
        games,
        pageNumber,
        pageSize,
        sortField,
        sortDir: _sortDir,
        count: await this.Save.countDocuments({userID}),
      },
    };
  }

  async execute(data, res) {

    try {
      const {pageNumber, pageSize, sortField, sortDir, userID} = data;

      const impl = await this.executeImpl({
        userID,
        pageNumber,
        pageSize,
        sortField,
        sortDir,
      });

      const { status, result } = impl;
      res.status(status).json(result);

    } catch (error) {
      console.error('Error getting game list:', error);
      res.status(500).json({message: 'Error getting game list', error});
    }
  }
}