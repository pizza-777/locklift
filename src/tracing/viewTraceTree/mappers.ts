import { MsgTree } from "../types";
import BigNumber from "bignumber.js";
import { ContractWithName } from "../../types";
import _ from "lodash";
import { Address } from "everscale-inpage-provider";
import { isT } from "../utils";

export const extractFeeFromMessage = (msg: MsgTree): BigNumber => {
  return new BigNumber(msg.dst_transaction?.total_fees || 0)
    .plus(msg.dst_transaction?.action?.total_fwd_fees || 0)
    .minus(msg.dst_transaction?.action?.total_action_fees || 0);
};
export const mapParams = (
  obj: Record<any, any> | Array<any> | undefined,
  contracts: Array<ContractWithName | undefined>,
): Record<any, any> => {
  if (Array.isArray(obj)) {
    return obj.map(mapRules(contracts));
  }
  return _(obj).mapValues(mapRules(contracts)).value();
};
const mapRules = (contracts: Array<ContractWithName | undefined>) => (value: any) => {
  if (value instanceof Address) {
    const contractName = contracts?.filter(isT).find(contract => contract.contract.address.equals(value))?.name;
    const contractAddress = value.toString().slice(0, 5) + "..." + value.toString().slice(-5);
    return contractName ? `${contractName}(${contractAddress})` : contractAddress;
  }
  if (typeof value === "string" && value.length >= 20) {
    return value.slice(0, 5) + "..." + value.slice(-5);
  }
  if (Array.isArray(value)) {
    return mapParams(value, contracts);
  }
  if (typeof value === "object") {
    return mapParams(value, contracts);
  }

  return value;
};
