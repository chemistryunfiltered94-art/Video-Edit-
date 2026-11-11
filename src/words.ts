export const SPEAK:Record<string,number[][]>={"shashanka": [[0.18, 0.64], [1.04, 3.74], [4.1, 6.0], [40.9, 45.08], [45.22, 46.86], [72.76, 76.32], [90.02, 90.54], [90.88, 91.58], [92.0, 93.72]], "maya": [[34.52, 35.24], [35.72, 35.76], [35.94, 37.66], [94.2, 96.44]]};
export const talk=(who:string,g:number):number=>{
  for(const [a,b] of SPEAK[who]){ if(g>=a&&g<=b){ return [1,2,1,2,0,1][Math.floor(g*11)%6]; } }
  return 0;
};
