import './App.css'
import { CAConfigPresets } from './helpers/configs/CAConfig';
import { DLAConfigPresets } from './helpers/configs/DLAConfig';
import { PNConfigPresets } from './helpers/configs/PNConfig';
import { VDConfigPresets } from './helpers/configs/VDConfig';
import Lab from './Lab'
import CA2DConfig from './showcase/CA/CAConfigPage';
import CA2DScene from './showcase/CA/CAScenePage';
import DLAConfigPage from './showcase/DLA/DLAConfigPage';
import DLAScenePage from './showcase/DLA/DLAScenePage';
import PNConfigPage from './showcase/PN/PNConfigPage';
import PNScenePage from './showcase/PN/PNScenePage';
import VDConfigPage from './showcase/VD/VDConfigPage';
import VDScenePage from './showcase/VD/VDScenePage';


const pairs = [
  {
    id: "ca",
    label: "Cellular Automata",
    scene: CA2DScene,
    config: CA2DConfig,
    defaultConfig: CAConfigPresets.default,
  },
  {
    id: "vd",
    label: "Voronoi Diagrams",
    scene: VDScenePage,
    config: VDConfigPage,
    defaultConfig: VDConfigPresets.default,
  },
  {
    id: "pn",
    label: "Perlin Noise",
    scene: PNScenePage,
    config: PNConfigPage,
    defaultConfig: PNConfigPresets.default,
  },
  {
    id: "dla",
    label: "Diffusion Limited Aggregation",
    scene: DLAScenePage,
    config: DLAConfigPage,
    defaultConfig: DLAConfigPresets.default,
  },
];

export default function App() {
  return <Lab pairs={pairs} />;
}
