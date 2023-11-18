import { isDefined, parseDate } from "src/app/utils/utils";
import { ICloudFileDescription } from "src/app/data/interfaces/descriptions/api/common/description";


export class CloudFile {

  public id: string;
  public name: string;
  public url: string;
  public description: string;
  public urlPath: string;
  public externalLink: string;
  public dateCreated?: string;

  constructor(cloudFileDescription: ICloudFileDescription) {

    // set id
    if (isDefined(cloudFileDescription.id)) {
      this.id = cloudFileDescription.id;

      // set created date from the ID => https://steveridout.github.io/
      this.dateCreated = parseDate(
        new Date(parseInt(cloudFileDescription.id.substring(0, 8), 16) * 1000).toISOString()
      );
    };

    this.name = cloudFileDescription.name;
    this.url = cloudFileDescription.url;

    if (!isDefined(cloudFileDescription.url)) {
      this.url = cloudFileDescription.externalLink;
    }

    // set description
    if (isDefined(cloudFileDescription.description)) {
      this.description = cloudFileDescription.description;
    };

    // set url path
    if (isDefined(cloudFileDescription.urlPath)) {
      this.urlPath = cloudFileDescription.urlPath;
    };

    // set external link
    if (isDefined(cloudFileDescription.externalLink)) {
      this.externalLink = cloudFileDescription.externalLink;
    };
  }
}
