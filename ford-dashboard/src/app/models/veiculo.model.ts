export interface Veiculos extends Array<Veiculo> {}

export interface Veiculo{
  id: number
  vehicle: string
  volumetotal: number
  connected: number
  softwareUpdates: number
  img: string
}

export interface VeiculosAPI {
  vehicles: Veiculos;
}

export interface VeiculoData {
  id: number;
  odometro: number;
  nivelCombustivel: number;
  status: string;
  lat: number;
  long: number;
}
