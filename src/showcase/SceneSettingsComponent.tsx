import { FaCamera } from "react-icons/fa";
import type { Dispatch, SetStateAction } from "react";
import type { SceneSettingsValues } from "../helpers/types/SceneSettings";
import * as Styled from "../helpers/ui/StyledPrimitives";

type SceneSettingsProps = {
  settings: SceneSettingsValues;
  setSettings: Dispatch<SetStateAction<SceneSettingsValues>>;
};

export default function SceneSettingsComponent({ settings, setSettings }: SceneSettingsProps) {
  return (
    <>
      <Styled.SceneSettingsButton
        type="button"
        $active={settings.resetCameraPosition}
        onClick={() => {
          setSettings((prev) => ({
            ...prev,
            resetCameraPosition: !prev.resetCameraPosition,
          }));
        }}
        title="Toggle reset camera position"
      >
        <FaCamera size={18} />
      </Styled.SceneSettingsButton>
    </>
  );
}
