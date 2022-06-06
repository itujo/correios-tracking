export interface Rastro {
  status: string;
  data: string;
  hora: string;
  local?: string;
  origem?: string;
  destino?: string;
}
export interface ApiResponse {
  id: number;
  sro: string;
  rastro: Rastro[] | null;
}

export interface SroEvent extends EventTarget {
  sro: {
    value: string;
  };
}

export interface CEvent extends EventTarget {
  firstChild?: {
    nodeValue?: string;
  };
}
