module.exports = {
    "root": true,
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:vue/essential"
    ],
    "parserOptions": {
        "ecmaVersion": 12,
        "sourceType": "module"
    },
    "plugins": [
        "vue"
    ],
    "rules": {
        'no-console': 0, // 禁用 console
        'no-unused-vars': [1, {
            'vars': 'all',
            'args': 'none'
        }], // 禁止出现未使用过的变量
        'indent': [0, 2], // 强制使用一致的缩进
        'eqeqeq': 1, // 要求使用 === 和 !==
        'space-before-function-paren': [0, 'never'], // 强制在 function的左括号之前使用一致的空格
        'keyword-spacing': [2, {
            'before': true,
            'after': true
        }], // 强制在关键字前后使用一致的空格
    }
};
