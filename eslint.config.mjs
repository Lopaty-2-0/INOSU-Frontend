// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs"

export default withNuxt({
    files: ["**/*.{js,mjs,cjs,ts,vue}"],
    rules: {
        "vue/multi-word-component-names": "off",
        "eqeqeq": ["error", "always"],
        "semi": ["error", "always"],
        "quotes": ["error", "double"],
        "no-console": "warn",
        "no-unused-vars": "warn",
    }
});
