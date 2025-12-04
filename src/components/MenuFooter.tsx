/*
 * @Author: colpu
 * @Date: 2025-06-26 10:19:21
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-11-25 21:56:28
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
import { createStyles } from "antd-style";
const useStyles = createStyles(({ token }) => {
  return {
    copyright: {
      fontSize: 10,
      color: token.colorInfoText,
      textAlign: "center",
      margin: 0,
    },
  };
});
export default function MenuFooter(props: { collapsed?: any }) {
  const { styles } = useStyles();
  if (props?.collapsed) return undefined;
  return (
    <p className={styles.copyright}>
      © 2025 Made with love
      <br />
      by Colpu CMS
    </p>
  );
}
