import autoImport from 'unplugin-auto-import/vite'

export default function createAutoImport() {
  return autoImport({
    imports: ['vue', 'vue-router', 'pinia'],
    dts: false,
    eslintrc: {
      enabled: false, // Default `false`需要注意的是，一旦生成配置文件之后，最好把改成false。否则这个文件每次会在重新加载的时候重新生成，这会导致eslint有时会找不到这个文件。
      filepath: './.eslintrc-auto-import.json',
      globalsPropValue: true // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
    }
  })
}
