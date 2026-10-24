export interface LocationInfo {
  name: string;
  url: string;
}

export interface Character {
  id: number;
  name: string;
  status: "Alive" | "Dead" | "unknown" | string;
  species: string;
  type: string;
  gender: "Female" | "Male" | "Genderless" | "unknown" | string;
  origin: LocationInfo;
  location: LocationInfo;
  image: string;
  episode: string[];
  url: string;
  created: string;
}

export interface RickAndMortyApiResponse {
  info: {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
  };
  results: Character[];
}
