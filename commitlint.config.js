/** @type {import("@commitlint/core").Config} */
export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "header-max-length": [2, "always", 280],
  },
};
