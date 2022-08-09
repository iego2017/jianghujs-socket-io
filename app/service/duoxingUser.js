"use strict";

// ========================================常用 require start===========================================
const Service = require("egg").Service;
const { BizError, errorInfoEnum } = require("../constant/error");
const { genderEnum, tableEnum, deviceTypeEnum } = require("../constant/constant");
const validateUtil = require("@jianghujs/jianghu/app/common/validateUtil");
// ========================================常用 require end=============================================
const _ = require("lodash");
const actionDataScheme = Object.freeze({
  setUserDetail: {
    type: "object",
    additionalProperties: true,
    required: [],
    properties: {
      username: { anyOf: [{ type: "string" }, { type: "null" }] },
      userAvatar: { anyOf: [{ type: "string" }, { type: "null" }] },
      contactNumber: { anyOf: [{ type: "string" }, { type: "null" }] },
      gender: {
        anyOf: [{ type: "string", enum: [genderEnum.male, genderEnum.female] }, { type: "null" }],
      },
      birthday: { anyOf: [{ type: "string", format: "date-time" }, { type: "null" }] },
      signature: { anyOf: [{ type: "string" }, { type: "null" }] },
      email: { anyOf: [{ type: "string" }, { type: "null" }] },
    },
  },
});

class DuoxingUserService extends Service {
  async setUserDetail() {
    const { actionData } = this.ctx.request.body.appData;
    const { jianghuKnex, config } = this.app;
    const { userInfo } = this.ctx;
    const { userId } = userInfo;
    validateUtil.validate(actionDataScheme.setUserDetail, actionData);

    const updateParams = _.pick(actionData, ["username", "userAvatar", "contactNumber", "gender", "birthday", "signature", "email"]);
    await jianghuKnex(tableEnum._user, this.ctx).where({ userId }).jhUpdate(updateParams);
    const newUserDatail = await jianghuKnex(tableEnum.view01_user).where({ userId }).first();
    return newUserDatail;
  }
}

module.exports = DuoxingUserService;
