import Mock from "mockjs";
const random = Mock.Random;
import { generateToken } from '../utils.ts'
export const users = [
  {
    id: 1,
    uid: "8367B77DC621CB4876CAAA1C71BF3857",
    username: "admin",
    nickname: "超级管理员",
    src: "https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg",
    gender: "male",
    salt: "03525b62-15aa-4ffe-a1ee-0385498e01f9",
    update_at: "2016-08-23T13:44:18.819Z",
    create_at: "2016-06-05T12:21:47.666Z",
    email: "admin@163.com",
    permissions: [
      "users-add",
      "users-delete",
      "users-update",
      "users-search",
      "users-reset-pass",
      "users-toggle-lock",
      "organization-add",
      "organization-delete",
      "organization-update",
      "organization-search",
      "role-add",
      "role-update",
      "role-delete",
      "role-search",
      "system",
      "system-004002",
      "system-004001",
      "system-002",
    ],
    roles: ["*"],

  },
  {
    id: 2,
    uid: "D54E1891FA76DDBDCC6194353F2C9C67",
    username: "manager",
    nickname: "管理员",
    src: "https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg",
    gender: "male",
    salt: "03525b62-15aa-4ffe-a1ee-0385498e01f9",
    update_at: "2016-08-23T13:44:18.819Z",
    create_at: "2016-06-05T12:21:47.666Z",
    email: "manager@163.com",
    permissions: [
      "users-add",
      "users-delete",
      "users-update",
      "users-search",
      "users-reset-pass",
      "users-toggle-lock",
      "organization-add",
      "organization-delete",
      "organization-update",
      "organization-search",
      "role-add",
      "role-update",
      "role-delete",
      "role-search",
      "system",
      "system-004002",
      "system-004001",
      "system-002",
    ],
    roles: ["admin"],

  },
  {
    id: 3,
    uid: "B11EF76265F6E3C1BE3E9FFE754AE4DE",
    username: "editor",
    nickname: "编辑人员",
    src: "https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg",
    gender: "male",
    update_at: "2016-08-23T13:44:18.819Z",
    create_at: "2016-06-05T12:21:47.666Z",
    email: "editor@163.com",
    permissions: [
      "users-add",
      "users-delete",
      "users-update",
      "users-search",
      "users-reset-pass",
      "users-toggle-lock",
      "organization-add",
      "organization-delete",
      "organization-update",
      "organization-search",
      "role-add",
      "role-update",
      "role-delete",
      "role-search",
      "system",
      "system-004002",
      "system-004001",
      "system-002",
    ],
    roles: ["editor"],
  }
];

function getName(name) {
  const bolRandom = Math.round(Math.random() * 2);
  switch (bolRandom) {
    case 2:
      return random.cfirst() + name + random.clast();
    case 1:
      return random.cfirst() + name;
    default:
      return name + random.clast();
  }
}
const jobs = ["程序员", "人事", "测试", "销售"];
function getJob(job) {
  return jobs[job];
}

export function getUserList({ pageSize, username, job }) {
  const users = [];
  for (let i = 0; i < pageSize; i++) {
    users.push(
      Mock.mock({
        id: i + 1,
        username: username ? getName(username) : random.cname(),
        "age|18-60": 1,
        "job|1": job !== undefined ? getJob(job) : jobs,
        nickname: random.word(),
        email: random.email(),
        'phone|1': /^1[3-9]\d{9}$/,
        "gender|1": ["male", "female"],
        position: "ceo",
        is_locked: false,
        is_first_login: false,
        remark: random.cparagraph(1),
        address: Mock.mock("@county(true)"),
        "group|1": ["jiagou", "yanfa"],
        birth: random.date(),
        sex: random.integer(0, 1),
      })
    );
  }
  return users;
}
export function getUser(id) {
  return users.find(item => item.id == id);
}

export function token({ body }) {
  const user = users.find(item => item.username === body.username);
  return generateToken(user);
}
