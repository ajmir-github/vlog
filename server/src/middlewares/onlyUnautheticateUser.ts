import { Request } from "express";

export default function onlyUnautheticatedUser(
  context: interContext,
  request: Request
) {
  return {};
}
