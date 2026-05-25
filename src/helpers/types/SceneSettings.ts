export type SceneSettingsValues = {
  resetCameraPosition: boolean;
};

export class SceneSettings {
  static default : SceneSettingsValues = {
    resetCameraPosition: true
  }
}
