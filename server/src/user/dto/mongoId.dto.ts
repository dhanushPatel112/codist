import { IsMongoId } from 'class-validator'

export class MongoIdDto {
    @IsMongoId({ message: 'Id is not valid' })
    id: string
}
