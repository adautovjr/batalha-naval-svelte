import water from '$lib/assets/images/water.png';
import ship1 from '$lib/assets/images/down/ship1.png';
import ship2 from '$lib/assets/images/down/ship2.png';
import ship3 from '$lib/assets/images/down/ship3.png';
import ship4 from '$lib/assets/images/down/ship4.png';
import ship5 from '$lib/assets/images/down/ship5.png';
import ship6 from '$lib/assets/images/down/ship6.png';
import ship1Wreck from '$lib/assets/images/down/wrecks/ship1.png';
import ship2Wreck from '$lib/assets/images/down/wrecks/ship2.png';
import ship3Wreck from '$lib/assets/images/down/wrecks/ship3.png';
import ship4Wreck from '$lib/assets/images/down/wrecks/ship4.png';
import ship5Wreck from '$lib/assets/images/down/wrecks/ship5.png';
import ship6Wreck from '$lib/assets/images/down/wrecks/ship6.png';
import hit from '$lib/assets/images/solo-hit.png';

interface ImagesContainer {
  [key: string]: string
}

const images: ImagesContainer = {
  water,
  ship1,
  ship2,
  ship3,
  ship4,
  ship5,
  ship6,
  ship1Wreck,
  ship2Wreck,
  ship3Wreck,
  ship4Wreck,
  ship5Wreck,
  ship6Wreck,
  hit
}

const getImage = (name: string) => {
  return images[name]
}

export default getImage