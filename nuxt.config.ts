// https://nuxt.com/docs/api/configuration/nuxt-config
import { readdirSync } from 'fs'
import swc from 'unplugin-swc'

export function getDirectories(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)
}

const appModulesFolders = getDirectories('./app-modules')

const modulesFoldersToComponentsPrefixes = (folderName: string) => {
  const customComponentPrefix = [
    { name: 'core', prefix: '' },
    { name: 'ux-system', prefix: 'x' },
  ].find((v) => v.name === folderName)

  if (!customComponentPrefix) {
    return folderName
  }

  return customComponentPrefix.prefix
}

export default defineNuxtConfig({
  devtools: { enabled: true },
  components: {
    dirs: [
      ...appModulesFolders.map((e) => ({
        path: `~/app-modules/${e}/components`,
        prefix: modulesFoldersToComponentsPrefixes(e),
        pathPrefix: false,
      })),
      '~/components',
    ],
  },
  imports: {
    dirs: ['app-modules/*/composables', 'app-modules/*/utils'],
  },
  dir: {
    middleware: 'app-modules/*/middlewares',
    plugins: 'app-modules/*/plugins',
  },
  vite: {
    plugins: [
      swc.vite(), // Плагин для восстановления поддержки декораторов в Vite
    ],
  },
})
