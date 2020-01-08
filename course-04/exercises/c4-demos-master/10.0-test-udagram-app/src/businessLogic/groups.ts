import * as uuid from 'uuid'

import { Group } from '../models/Group'
import { GroupAccess } from '../dataLayer/groupsAccess'
import { CreateGroupRequest } from '../requests/CreateGroupRequest'
import { getUserId } from '../auth/utils'

const groupAccess = new GroupAccess()

export const getAllGroups = async (): Promise<Group[]> => {
  return groupAccess.getAllGroups()
}

export const createGroup = async (createGroupRequest: CreateGroupRequest, jwtToken: string): Promise<Group> => {
  const itemId = uuid.v4()
  const userId = getUserId(jwtToken)

  return await groupAccess.createGroup({
    id: itemId,
    userId,
    name: createGroupRequest.name,
    description: createGroupRequest.description,
    timestamp: new Date().toISOString()
  })
}