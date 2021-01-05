import { AccAddress, Coins, Dec, Int } from "@terra-money/terra.js";
import * as _ from "lodash";

export type InputParser<T> = (input?: string) => T;

export namespace Parse {
  export function accAddress(input?: string): AccAddress {
    if (input === undefined) return undefined;

    if (!AccAddress.validate(input)) {
      throw new Error(`Invalid Terra account address: ${input}`);
    }

    return input;
  }

  export function int(input?: string): number {
    if (input === undefined) {
      return undefined;
    }
    return Number.parseInt(input);
  }

  export function uint128(input?: string): Int {
    if (input === undefined) {
      return undefined;
    }
    return new Int(input);
  }

  export function coins(input?: string): Coins {
    if (input === undefined) {
      return undefined;
    }
    return Coins.fromString(input);
  }

  export function dec(input?: string): Dec {
    if (input === undefined) {
      return undefined;
    }
    return new Dec(input);
  }
}
