/**
 * @Author: colpu
 * @Date: 2025-03-18 15:40:49
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-10-28 15:09:39
 * @
 * @Copyright (c) 2025 by colpu, All Rights Reserved.
 */
import Mock from 'mockjs';

export function getRoleList(query) {
  const list = [];
  for (let i = 0; i < query.pageSize; i++) {
    list.push(Mock.mock({
      id: Mock.Random.guid(),
      name: Mock.Random.cname(),
      description: Mock.Random.cparagraph(1),
    }));
  }
  return list;
}
