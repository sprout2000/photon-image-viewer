import { build } from "electron-builder";

build({
  config: {
    productName: "Photon Image Viewer",
    artifactName: "${productName}-${version}-${platform}-${arch}.${ext}",
    copyright: "© 2024 sprout2000",
    directories: {
      output: "release",
      buildResources: "assets",
    },
    files: ["dist/**/*"],
    win: {
      icon: "assets/icon.ico",
      target: ["nsis"],
      fileAssociations: [
        {
          ext: ["bmp", "gif", "jpeg", "jpg", "png", "ico", "svg", "webp"],
          description: "Image files",
        },
      ],
    },
    nsis: {
      oneClick: false,
      perMachine: false,
      createDesktopShortcut: false,
      createStartMenuShortcut: true,
      installerIcon: "assets/installer.ico",
      artifactName:
        "${productName}-${version}-${platform}-${arch}-installer.${ext}",
    },
    mac: {
      appId: "jp.wassabie64.Photon Image Viewer",
      category: "public.app-category.photography",
      target: ["default"],
      icon: "assets/icon.icns",
      darkModeSupport: true,
      extendInfo: {
        CFBundleName: "Photon Image Viewer",
        CFBundleDisplayName: "Photon Image Viewer",
        CFBundleExecutable: "Photon Image Viewer",
        CFBundlePackageType: "APPL",
        CFBundleDocumentTypes: [
          {
            CFBundleTypeName: "ImageFile",
            CFBundleTypeRole: "Viewer",
            LSItemContentTypes: [
              "com.google.webp",
              "com.microsoft.bmp",
              "com.microsoft.ico",
              "com.compuserve.gif",
              "public.jpeg",
              "public.png",
            ],
            LSHandlerRank: "Default",
          },
        ],
        NSRequiresAquaSystemAppearance: false,
      },
      identity: null,
    },
  },
});
