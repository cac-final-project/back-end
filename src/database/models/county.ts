import { Sequelize, DataTypes, Model } from 'sequelize';

declare global {
    interface County extends TimeStampModel {
        state: string;
        zone: string;
        cwa: string;
        name: string;
        state_zone: string;
        county: string;
        fips: string;
        time_zone: string;
        fe_area: string;
        lat: number;
        lon: number;
    }

    type CountyCreateInterface = Omit<
        County,
        'createdAt' | 'updatedAt' | 'deletedAt'
    >;
}

export class CountyModel
    extends Model<County, CountyCreateInterface>
    implements County
{
    public state!: string;
    public zone!: string;
    public cwa!: string;
    public name!: string;
    public state_zone!: string;
    public county!: string;
    public fips!: string;
    public time_zone!: string;
    public fe_area!: string;
    public lat!: number;
    public lon!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const CountyGenerator = (sequelize: Sequelize): typeof CountyModel => {
    CountyModel.init(
        {
            state: {
                type: DataTypes.STRING(2),
                allowNull: false,
            },
            zone: {
                type: DataTypes.STRING(3),
                allowNull: false,
            },
            cwa: {
                type: DataTypes.STRING(3),
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            state_zone: {
                type: DataTypes.STRING(5),
                allowNull: false,
            },
            county: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            fips: {
                type: DataTypes.STRING(5),
                allowNull: false,
            },
            time_zone: {
                type: DataTypes.STRING(1),
                allowNull: false,
            },
            fe_area: {
                type: DataTypes.STRING(2),
                allowNull: false,
            },
            lat: {
                type: DataTypes.DECIMAL(9, 6),
                allowNull: false,
            },
            lon: {
                type: DataTypes.DECIMAL(9, 6),
                allowNull: false,
            },
        },
        {
            sequelize,
            tableName: 'county',
            timestamps: true,
            paranoid: true, // Enables soft-deletion
        },
    );
    return CountyModel;
};
