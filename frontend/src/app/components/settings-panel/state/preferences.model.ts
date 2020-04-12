export interface Preferences {
    sizeMapping: SizeMapping;
    colorMapping: ColorMappingPreference;
}

export interface SizeMapping {
    height: string;
    width: string;
    depth: string;
}

export interface ColorMappingPreference {
    buildingColor: string;
    districtColor: string;
}

export enum SizeMapperPreference {
    number_lines_sqrt = 'Number of lines (Sqrt)',
    number_lines_1on1 = 'Number of lines (1:1)'
}

export enum BuildingColorMapperPreference {
    author = 'Author',
    random = 'Random'
}
