import Mock from "mockjs";
const random = Mock.Random;
export const LoginUsers = [
  {
    userInfo: {
      id: "5754195b570b367345584998",
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
    token: "mock-all-token",
    refreshToken: "mock-all-refreshToken",
  },
  {
    userInfo: {
      id: "5754195b570b367345584998",
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
    token: "mock-admin-token",
    refreshToken: "mock-admin-refreshToken",
  },
  {
    userInfo: {
      id: "5754195b570b367345584998",
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
    },
    token: "mock-editor-token",
    refreshToken: "mock-editor-refreshToken",
  },
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

export function getUsersByPageSize(pageSize, username, job) {
  const users = [];
  for (let i = 0; i < pageSize; i++) {
    users.push(
      Mock.mock({
        id: random.guid(),
        username: username ? getName(username) : random.cname(),
        "age|18-60": 1,
        "job|1": job !== undefined ? getJob(job) : jobs,
        nickname: random.word(),
        email: random.email(),
        mobile: random.phone(),
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

export function login({ body }) {
  const res = LoginUsers.find(
    (item) => item.userInfo.username === body.username
  );
  return res;
}
