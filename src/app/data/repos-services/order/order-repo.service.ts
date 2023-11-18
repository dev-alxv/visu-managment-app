import { Injectable } from "@angular/core";
import { EMPTY, forkJoin, iif, Observable, of } from "rxjs";
import { map, mergeMap, switchMap, tap } from "rxjs/operators";

import { ApiService } from "../../providers/api/api.service";
import { deepCopy, isDefined } from "src/app/utils/utils";
import {
  IAddOrderCommentIntent,
  IAddOrderFloorIntent,
  IAssignUserToOrderIntent,
  ICreateOrderIntent,
  IDeleteOrderAttachmentIntent,
  IDeleteOrderFloorIntent,
  IDeleteOrderIntent,
  IEditOrderIntent,
  ILogOrderWorkTimeIntent,
  IOrderCollectionRequest,
  IOrderRequest,
  ISendOrderActionIntent,
  ISendOrderAttachmentIntent,
  ISendOrderFloorActionIntent
} from "src/app/domain/interfaces/order/order.interfaces";
import {
  ICreateOrderIntentDescription,
  IOrderCollectionSliceRequestResponseDescription,
  IOrderCollectionSliceRequestDescription,
  IOrderDescription,
  OrderDescription,
  IDeleteOrderIntentDescription,
  IAddOrderCommentIntentDescription,
  IOrderCommentDescription,
  IOrderFloorDescription,
  IAddOrderFloorIntentDescription,
  IAssignUserToOrderIntentDescription,
  IEditOrderIntentDescription,
  ISendOrderActionIntentDescription,
  IOrderProjectFileDescription,
  IGetOrderRequestData,
  IOrderCreationDescription,
  IAddOrderLogoWatermarkIntentDescription,
  ISearchOrderRequestData,
  IOrderEditionDescription,
  IDeliverOrderIntentDescription,
  ILogOrderWorkTimeIntentDescription,
  ILogOrderWorkTimeData
} from "../../interfaces/descriptions/api/order/description";
import { IOrderRequestResponseData } from "src/app/domain/interfaces/request-response/order.response";
import { Order, OrderFloor } from "src/app/domain/models/Order/order.model";
import { OrderPriorityEnum } from "src/app/domain/enums/order/order.enum";
import { IOrderIntentResponseData } from "src/app/domain/interfaces/intent-response/order.response";
import { CloudFile } from "src/app/domain/models/Common/common.models";
import { ICloudFileDescription, IExternalFileDescription } from "../../interfaces/descriptions/api/common/description";
import {LoggerService} from "src/app/utils/logger.service";

@Injectable()
export class OrderRepoService {

  constructor(
    private apiService: ApiService, private loggerService: LoggerService
  ) { }

  public list(reqParams: IOrderCollectionRequest): Observable<IOrderRequestResponseData> {

    const requestDescription: IOrderCollectionSliceRequestDescription = {};
    let requestSearchData: ISearchOrderRequestData;

    if (isDefined(reqParams.pageData.pageNumber)) {
      requestDescription.page = reqParams.pageData.pageNumber;
      // requestDescription.pageNumber = reqParams.pageData.pageNumber;
    }

    if (isDefined(reqParams.pageData.ordersPerPage)) {
      requestDescription.pageSize = reqParams.pageData.ordersPerPage;
    }

    if (isDefined(reqParams.searchData) && isDefined(reqParams.searchData.input)) {
      requestSearchData = {
        input: reqParams.searchData.input,
        searchBy: 'intId'
      };
    }

    if (isDefined(reqParams.filterData) && isDefined(reqParams.filterData.sortBy)) {
      requestDescription.sortBy = reqParams.filterData.sortBy;
    }

    if (isDefined(reqParams.filterData) && isDefined(reqParams.filterData.users) && reqParams.filterData.users.length > 0) {
      requestDescription.assigneeIDs = reqParams.filterData.users;
    }

    if (isDefined(reqParams.filterData) && isDefined(reqParams.filterData.statuses) && reqParams.filterData.statuses.length > 0) {
      requestDescription.statuses = reqParams.filterData.statuses;
    }

    if (isDefined(reqParams.filterData) && isDefined(reqParams.filterData.customers) && reqParams.filterData.customers.length > 0) {
      requestDescription.customerIDs = reqParams.filterData.customers;
    }

    if (isDefined(reqParams.filterData) && isDefined(reqParams.filterData.services) && reqParams.filterData.services.length > 0) {
      requestDescription.serviceTypes = reqParams.filterData.services;
    }

    this.loggerService.info('Request Description', requestDescription, this.constructor.name)
    /*console.log(requestDescription);*/

    return this.parseOrderCollectionSliceRequestResponse(requestDescription, requestSearchData);
  }

  public get(requestData: IOrderRequest): Observable<IOrderRequestResponseData> {

    const requestDescription: IGetOrderRequestData = {
      orderId: requestData.orderId,
      idType: requestData.idType
    };

    return this.apiService.getOrderRequest(requestDescription)
      .pipe(
        map((response: OrderDescription) => {

          let requestResponseData: IOrderRequestResponseData = {};

          if (response) {
            requestResponseData = {
              result: 'Ok',
              order: this.createOrder(response)
            }
          };

          return requestResponseData;
        })
      );
  }

  public create(intentData: ICreateOrderIntent): Observable<IOrderIntentResponseData> {

    const floors: boolean = isDefined(intentData.newFloors) && intentData.newFloors.length > 0;
    const attachments: boolean = isDefined(intentData.newAttachments) && intentData.newAttachments.length > 0;
    const logoOrWatermark: boolean = isDefined(intentData.newLogoWatermark.logo) || isDefined(intentData.newLogoWatermark.watermark);

    if (!attachments && !logoOrWatermark) {

      const intentDescription: ICreateOrderIntentDescription = {
        newOrder: this.parseToOrderCreationDescription(intentData.newOrder, intentData.customerId)
      };

      return this.apiService.createOrderIntent(intentDescription)
        .pipe(
          map((response: IOrderDescription) => {

            let intentResponseData: IOrderIntentResponseData = {} as IOrderIntentResponseData;

            intentResponseData = {
              result: 'Ok',
              createdOrder: this.createOrder(response)
            };

            return intentResponseData;
          })
        );

    } else {

      return forkJoin([
        isDefined(intentData.newLogoWatermark.logo) ? this.apiService.uploadFilesToCloudIntent([intentData.newLogoWatermark.logo]) : of<ICloudFileDescription[]>([]),
        isDefined(intentData.newLogoWatermark.watermark) ? this.apiService.uploadFilesToCloudIntent([intentData.newLogoWatermark.watermark]) : of<ICloudFileDescription[]>([]),
        isDefined(intentData.newAttachments) && intentData.newAttachments.length > 0 ? this.apiService.uploadFilesToCloudIntent(intentData.newAttachments) : of<ICloudFileDescription[]>([])
      ]).pipe(
        mergeMap((response: [ICloudFileDescription[], ICloudFileDescription[], ICloudFileDescription[]]) => {

          const newOrderData: Partial<Order> = { ...intentData.newOrder };
          const attachments = {
            logo: response[0],
            watermark: response[1],
            files: response[2]
          };

          const intentDescription: ICreateOrderIntentDescription = {
            newOrder: this.parseToOrderCreationDescription(newOrderData, intentData.customerId, attachments)
          };

          return this.apiService.createOrderIntent(intentDescription)
            .pipe(
              map((response: IOrderDescription) => {

                let intentResponseData: IOrderIntentResponseData = {};

                intentResponseData = {
                  result: 'Ok',
                  createdOrder: this.createOrder(response)
                };

                return intentResponseData;
              })
            );
        })
      );
    }

    // return this.apiService.createOrderIntent(intentDescription)
    //   .pipe(
    //     tap((response: IOrderDescription) => intentResponseDataSum.createdOrder = this.createOrder(response)),
    //     switchMap(() => {
    //       // Send order floors if any
    //       return iif(() => floors && !attachments,
    //         this.apiService.addOrderFloorIntent(this.createAddOrderFloorIntent(intentData.newFloors), intentResponseDataSum.createdOrder.ids.main)
    //           .pipe(
    //             tap((response: Partial<IOrderFloorDescription>[]) => intentResponseDataSum.cratedOrderFloorList = this.createOrderFloorCollection(response))
    //           ),
    //         of(EMPTY)
    //       );
    //     }),
    //     switchMap(() => {
    //       // Send order attachments if any
    //       return iif(() => attachments && !floors,
    //         this.apiService.addOrderAttachmentIntent(intentData.newAttachments, intentResponseDataSum.createdOrder.ids.main)
    //           .pipe(
    //             tap((response: Partial<ICloudFileDescription>[]) => intentResponseDataSum.createdOrderAttachmentsList = this.createCloudFileCollection(response))
    //           ),
    //         of(EMPTY)
    //       );
    //     }),
    //     switchMap(() => {
    //       // Send order floors and attachments together
    //       return iif(() => floors && attachments,
    //         forkJoin([
    //           this.apiService.addOrderFloorIntent(this.createAddOrderFloorIntent(intentData.newFloors), intentResponseDataSum.createdOrder.ids.main),
    //           this.apiService.addOrderAttachmentIntent(intentData.newAttachments, intentResponseDataSum.createdOrder.ids.main)
    //         ]).pipe(
    //           map((response: (Partial<IOrderFloorDescription> | Partial<ICloudFileDescription>)[][]) => this.parseAddOrderFloorAndAttachmentsIntentResponse(response[0], response[1]))
    //         ),
    //         of(EMPTY)
    //       );
    //     }),
    //     map((response: Observable<never> | { floors: OrderFloor[], files: CloudFile[] }) => {

    //       let intentResponseData: IOrderIntentResponseData = {} as IOrderIntentResponseData;

    //       if (response instanceof Observable) {

    //         intentResponseData = {
    //           ...intentResponseDataSum,
    //           result: 'Ok'
    //         }

    //       } else {

    //         intentResponseData = {
    //           result: 'Ok',
    //           cratedOrderFloorList: response.floors,
    //           createdOrderAttachmentsList: response.files
    //         }
    //       }

    //       return intentResponseData;
    //     })
    //   );
  }

  public edit(intentData: IEditOrderIntent): Observable<IOrderIntentResponseData> {

    const floors: boolean = isDefined(intentData.newFloors) && intentData.newFloors.length > 0;
    const attachments: boolean = isDefined(intentData.newAttachments) && intentData.newAttachments.length > 0;
    const newLogoOrWatermark: boolean = isDefined(intentData.newLogo) || isDefined(intentData.newWatermark);

    if (attachments || newLogoOrWatermark) {

      const filesToUpload: File[] = [
        ...attachments ? intentData.newAttachments : [],
        isDefined(intentData.newLogo) ? intentData.newLogo : undefined,
        isDefined(intentData.newWatermark) ? intentData.newWatermark : undefined
      ].filter((f: File) => isDefined(f));

      return this.apiService.uploadFilesToCloudIntent(filesToUpload)
        .pipe(
          switchMap((uploadResponse: ICloudFileDescription[]) => {

            const uploadedLogo: ICloudFileDescription = isDefined(intentData.newLogo) ? uploadResponse.find((file: ICloudFileDescription) => file.name === intentData.newLogo.name) : undefined;
            const uploadedWatermark: ICloudFileDescription = isDefined(intentData.newWatermark) ? uploadResponse.find((file: ICloudFileDescription) => file.name === intentData.newWatermark.name) : undefined;
            let uploadedAttachments: ICloudFileDescription[] = attachments ? uploadResponse : [];

            if (isDefined(uploadedLogo) && uploadedAttachments.length) {
              uploadedAttachments = uploadedAttachments.filter((file: ICloudFileDescription) => file.name !== uploadedLogo.name);
            }

            if (isDefined(uploadedWatermark) && uploadedAttachments.length) {
              uploadedAttachments = uploadedAttachments.filter((file: ICloudFileDescription) => file.name !== uploadedWatermark.name);
            }

            const intentDescription: IEditOrderIntentDescription = {
              editedOrder: this.parseToOrderEditionDescription(intentData, { logo: uploadedLogo, watermark: uploadedWatermark, files: uploadedAttachments })
            };

            return this.apiService.editOrderIntent(intentDescription, intentData.orderId)
              .pipe(
                map((response: IOrderDescription) => {

                  let intentResponseData: IOrderIntentResponseData = {
                    result: 'Ok',
                    changedOrder: this.createOrder(response)
                  };

                  return intentResponseData;
                })
              )
          })
        );

    } else {

      const intentDescription: IEditOrderIntentDescription = {
        editedOrder: this.parseToOrderEditionDescription(intentData)
      };

      return this.apiService.editOrderIntent(intentDescription, intentData.orderId)
        .pipe(
          map((response: IOrderDescription) => {

            let intentResponseData: IOrderIntentResponseData = {
              result: 'Ok',
              changedOrder: this.createOrder(response)
            };

            return intentResponseData;
          })
        );
    }
  }

  public delete(intentData: IDeleteOrderIntent): Observable<IOrderIntentResponseData> {

    const intentDescription: IDeleteOrderIntentDescription = {
      orderToDeleteId: intentData.orderToDeleteId
    };

    return this.parseNullIntentResponse(this.apiService.deleteOrderIntent(intentDescription));
  }

  public comment(intentData: IAddOrderCommentIntent): Observable<IOrderIntentResponseData> {

    const intendDescription: IAddOrderCommentIntentDescription = {
      content: intentData.commentText
    };

    return this.apiService.addOrderCommentIntent(intendDescription, intentData.orderId)
      .pipe(
        map((response: IOrderCommentDescription) => {

          let intentResponseData: IOrderIntentResponseData = {} as IOrderIntentResponseData;

          if (response) {
            intentResponseData = {
              result: 'Ok',
              addedOrderComment: {
                ids: {
                  main: response.id,
                  userID: response.userInfo.userID
                },
                creator: {
                  email: response.userInfo.email,
                  firstName: response.userInfo.firstName,
                  lastName: response.userInfo.lastName
                },
                content: response.content,
                date: response.id
              }
            }
          }

          return intentResponseData;
        })
      );
  }

  public action(intentData: ISendOrderActionIntent): Observable<IOrderIntentResponseData> {

    if (intentData.actionType === 'DELIVER') {

      const deliverData: IDeliverOrderIntentDescription = {
        orderId: intentData.orderId,
        sendAllFiles: 'true'
      };

      return this.apiService.deliverOrderIntent(deliverData)
        .pipe(
          map((response: IOrderDescription) => {

            let intentResponseData: IOrderIntentResponseData = {
              result: 'Ok',
              changedOrder: undefined
            };

            return intentResponseData;
          })
        );

    } else {

      const intentDescription: ISendOrderActionIntentDescription = {
        actionType: intentData.actionType
      };

      return this.apiService.sendOrderActionIntent(intentDescription, intentData.orderId)
        .pipe(
          map((response: IOrderDescription) => {

            let intentResponseData: IOrderIntentResponseData = {
              result: 'Ok',
              changedOrder: this.createOrder(response)
            };

            return intentResponseData;
          })
        );
    }
  }

  public attach(intentData: ISendOrderAttachmentIntent): Observable<IOrderIntentResponseData> {

    const logoOrWatermark: boolean = isDefined(intentData.logo) || isDefined(intentData.watermark);

    if (!logoOrWatermark) {

      const files: File[] = [...intentData.attachments];

      return this.apiService.addOrderAttachmentIntent(files, intentData.orderId)
        .pipe(
          map((response: Partial<ICloudFileDescription>[]) => {

            // this.apiService.addOrderLogoWatermarkIntent(response, intentData.orderId);

            const intentResponseData: IOrderIntentResponseData = {
              result: 'Ok',
              createdOrderAttachmentsList: this.createCloudFileCollection(response)
            };

            return intentResponseData;
          })
        );

    } else {

      return forkJoin([
        isDefined(intentData.logo) ? this.apiService.uploadFilesToCloudIntent([intentData.logo]) : of<ICloudFileDescription[]>([]),
        isDefined(intentData.watermark) ? this.apiService.uploadFilesToCloudIntent([intentData.watermark]) : of<ICloudFileDescription[]>([]),
        isDefined(intentData.attachments) && intentData.attachments.length > 0 ? this.apiService.addOrderAttachmentIntent([...intentData.attachments], intentData.orderId) : of<File[]>([])
      ]).pipe(
        mergeMap((responseArray: [ICloudFileDescription[], ICloudFileDescription[], Partial<ICloudFileDescription>[] | File[]]) => {

          const intendDescription: IAddOrderLogoWatermarkIntentDescription = {};

          // Set logo
          if (responseArray[0].length) {
            intendDescription.logo = this.parseToExternalFileDescription(responseArray[0][0]);
          }

          // Set waterMark
          if (responseArray[1].length) {
            intendDescription.watermark = this.parseToExternalFileDescription(responseArray[1][0]);
          }

          return this.apiService.addOrderLogoWatermarkIntent(intendDescription, intentData.orderId)
            .pipe(
              map((response: null) => {

                const intentResponseData: IOrderIntentResponseData = {
                  result: 'Ok'
                };

                if (responseArray[2].length) {
                  intentResponseData.createdOrderAttachmentsList = this.createCloudFileCollection(responseArray[2]);
                }

                return intentResponseData;
              })
            );
        })
      );
    }

  }

  public assign(intentData: IAssignUserToOrderIntent): Observable<IOrderIntentResponseData> {

    const intentDescription: IAssignUserToOrderIntentDescription = {
      assigneeID: intentData.userId
    };

    return this.parseNullIntentResponse(this.apiService.assignUserToOrderIntent(intentDescription, intentData.orderId));
  }

  public logTime(intentData: ILogOrderWorkTimeIntent): Observable<IOrderIntentResponseData> {

    const intentDescription: ILogOrderWorkTimeIntentDescription = {
      logTime: parseInt(intentData.timeLogged)
    };

    const logTimeData: ILogOrderWorkTimeData = {
      orderId: intentData.orderId,
      completeOrder: intentData.completeOrder ? 'true' : 'false',
      unassignOrder: intentData.unassignOrder ? 'true' : 'false'
    }

    if (isDefined(intentData.comment) && intentData.comment !== '') {
      intentDescription.comment = intentData.comment;
    }

    return this.apiService.logOrderWorkTimeIntent(intentDescription, logTimeData)
      .pipe(
        map((response: IOrderDescription) => {

          let intentResponseData: IOrderIntentResponseData = {
            result: 'Ok',
            changedOrder: this.createOrder(response)
          };

          return intentResponseData;
        })
      );
  }

  public addFloor(intentData: IAddOrderFloorIntent): Observable<IOrderIntentResponseData> {

    const intendDescription: IAddOrderFloorIntentDescription = this.createAddOrderFloorIntent(intentData.floorList);

    return this.apiService.addOrderFloorIntent(intendDescription, intentData.orderId)
      .pipe(
        map((response: Partial<IOrderFloorDescription>[]) => {

          let intentResponseData: IOrderIntentResponseData = {} as IOrderIntentResponseData;

          if (response) {
            intentResponseData = {
              result: 'Ok',
              cratedOrderFloorList: this.createOrderFloorCollection(response)
            }
          }

          return intentResponseData;
        })
      );
  }

  public floorAction(intentData: ISendOrderFloorActionIntent): Observable<IOrderIntentResponseData> {

    switch (intentData.actionType) {

      case 'UPLOAD_SOURCE_FILE':
        return this.parseAttachFloorFileIntentResponse(this.apiService.addOrderFloorAttachmentIntent(intentData.sourceFile, 'source-file', intentData.orderId, intentData.floorId));

      case 'UPLOAD_JSON_FILE':
        return this.parseAttachFloorJSONIntentResponse(this.apiService.addOrderFloorAttachmentIntent(intentData.sourceFile, 'json-file', intentData.orderId, undefined, intentData.floorNumber));

      case 'DELETE_PROJECT_DATA':
        return this.parseNullIntentResponse(this.apiService.deleteOrderFloorProjectDataIntent(intentData.floorNumber, intentData.orderId));
    }
  }

  public deleteFloor(intentData: IDeleteOrderFloorIntent): Observable<IOrderIntentResponseData> {

    return this.parseNullIntentResponse(this.apiService.deleteOrderFloorIntent(intentData.floorToDeleteId, intentData.orderId));
  }

  public deleteAttachment(intentData: IDeleteOrderAttachmentIntent): Observable<IOrderIntentResponseData> {

    switch (intentData.attachmentType) {

      case 'Data':
        return this.parseNullIntentResponse(this.apiService.deleteOrderAttachmentIntent(intentData.attachmentToDeleteId, intentData.orderId));

      case 'Logo':
        return this.parseNullIntentResponse(this.apiService.deleteOrderLogoAttachment(intentData.orderId));

      case 'Watermark':
        return this.parseNullIntentResponse(this.apiService.deleteOrderWatermarkAttachment(intentData.orderId));
    }
  }

  ///////

  private createAddOrderFloorIntent(intentData: Partial<OrderFloor>[]): IAddOrderFloorIntentDescription {

    const intentDescription: IAddOrderFloorIntentDescription = {
      floors: intentData.map((f: OrderFloor) => {

        const newFloorDescription: IOrderFloorDescription = {
          name: f.name,
          floorNumber: f.floorNumber
        };

        return newFloorDescription;
      })
    };

    return intentDescription;
  }

  private parseOrderCollectionSliceRequestResponse(requestDescription: IOrderCollectionSliceRequestDescription, requestSearchData: ISearchOrderRequestData): Observable<IOrderRequestResponseData> {

    if (isDefined(requestSearchData) && requestSearchData.searchBy === 'intId') {

      return this.apiService.getOrderCollectionBySearchRequest(requestSearchData)
        .pipe(
          map((response: OrderDescription[]) => {

            let requestResponseData: IOrderRequestResponseData = {};

            if (response) {
              requestResponseData = {
                result: 'Ok',
                orderCollection: this.createOrderCollection(response),
                pageData: {
                  pageNumber: 0,
                  pageSize: 10,
                  pageTotal: response.length
                }
              } as IOrderRequestResponseData;
            }

            return requestResponseData;
          })
        );
    } else {

      return this.apiService.getOrderCollectionSliceRequest(requestDescription)
        .pipe(
          map((response: IOrderCollectionSliceRequestResponseDescription) => {

            let requestResponseData: IOrderRequestResponseData = {};

            if (response) {
              requestResponseData = {
                result: 'Ok',
                orderCollection: this.createOrderCollection(response.content),
                pageData: {
                  pageNumber: response.pageNumber,
                  pageSize: response.pageSize,
                  pageTotal: response.total
                }
              } as IOrderRequestResponseData;
            }

            return requestResponseData;
          })
        );
    }
  }

  private parseAddOrderFloorAndAttachmentsIntentResponse(floorList?: Partial<IOrderFloorDescription>[], attachmentList?: Partial<ICloudFileDescription>[]): { floors: OrderFloor[], files: CloudFile[] } {

    const sumCollection: { floors: OrderFloor[], files: CloudFile[] } = {
      floors: this.createOrderFloorCollection(floorList),
      files: this.createCloudFileCollection(attachmentList)
    };

    return sumCollection;
  }

  private parseAttachFloorFileIntentResponse(floorSourceFileUpload?: Observable<Partial<ICloudFileDescription> | Partial<IOrderProjectFileDescription[]>>): Observable<IOrderIntentResponseData> {

    return floorSourceFileUpload
      .pipe(
        map((response: Partial<IOrderProjectFileDescription[]> | Partial<ICloudFileDescription>) => {

          let intentResponseData: IOrderIntentResponseData = {
            result: 'Ok',
            // createdOrderAttachmentsList: response
          };

          return intentResponseData;
        })
      );
  }

  private parseAttachFloorJSONIntentResponse(floorJSONFileUpload?: Observable<Partial<ICloudFileDescription> | Partial<IOrderProjectFileDescription[]>>): Observable<IOrderIntentResponseData> {

    return floorJSONFileUpload
      .pipe(
        map((response: Partial<IOrderProjectFileDescription[]> | Partial<ICloudFileDescription>) => {

          let intentResponseData: IOrderIntentResponseData = {
            result: 'Ok',
            // createdOrderAttachmentsList: response
          };

          return intentResponseData;
        })
      );
  }

  private parseNullIntentResponse(intentResponse: Observable<null>): Observable<IOrderIntentResponseData> {

    return intentResponse
      .pipe(
        map((response: null) => {

          let intentResponseData: IOrderIntentResponseData = {
            result: 'Ok'
          };

          return intentResponseData;
        })
      );
  }

  private createOrderCollection(collectionDescription: OrderDescription[]): Order[] {
    return collectionDescription.map((description: OrderDescription) => this.createOrder(description));
  }

  private createOrderFloorCollection(collectionDescription: IOrderFloorDescription[]): OrderFloor[] {
    return collectionDescription.map((description: IOrderFloorDescription) => this.createOrderFloor(description));
  }

  private createCloudFileCollection(collectionDescription: ICloudFileDescription[]): CloudFile[] {
    return collectionDescription.map((description: ICloudFileDescription) => this.createCloudFile(description));
  }

  private createOrder(orderDescription: OrderDescription): Order {

    const order: Order = new Order(orderDescription);

    return order;
  }

  private createOrderFloor(orderFloorDescription: IOrderFloorDescription): OrderFloor {

    const floor: OrderFloor = new OrderFloor(orderFloorDescription);

    return floor;
  }

  private createCloudFile(fileDescription: ICloudFileDescription): CloudFile {

    const file: CloudFile = new CloudFile(fileDescription);

    return file;
  }

  private parseToCloudFileDescription(cloudFile: Partial<CloudFile>): ICloudFileDescription {

    const file: ICloudFileDescription = {
      id: cloudFile.id,
      externalLink: cloudFile.url,
      url: cloudFile.url,
      name: cloudFile.name,
      description: cloudFile.description
    }

    return file;
  }

  private parseToOrderFloorCollectionDescription(floorList: Partial<OrderFloor>[]): IOrderFloorDescription[] {

    return floorList.map((f: Partial<OrderFloor>) => {

      const newFloorDescription: IOrderFloorDescription = {
        name: f.name,
        floorNumber: f.floorNumber
      };

      if (isDefined(f.id)) {
        newFloorDescription.id = f.id;

        if (isDefined(f.sourceFile)) {
          newFloorDescription.sourceFile = this.parseToCloudFileDescription(f.sourceFile);
        }

        if (isDefined(f.projectFilesDescription)) {
          newFloorDescription.projectFiles = f.projectFilesDescription.map((file: IOrderProjectFileDescription) => {

            file.file.externalLink = file.file.url;

            return file;
          });
        }
      }

      return newFloorDescription;
    });
  }

  private parseToExternalFileDescription(cloudFile: ICloudFileDescription, onEdit?: boolean): IExternalFileDescription {

    const file: IExternalFileDescription = {
      name: cloudFile.name,
      externalLink: cloudFile.url,
      description: cloudFile.description
    };

    if (isDefined(cloudFile.id) && onEdit) {
      file.id = cloudFile.id;
    }

    return file;
  }

  private parseToOrderCreationDescription(orderData: Partial<Order>, customerId: string,
    attachments?: { logo: ICloudFileDescription[], watermark: ICloudFileDescription[], files: ICloudFileDescription[] }): Partial<IOrderCreationDescription> {

    const newOrderCreationDescription: Partial<IOrderCreationDescription> = {

      // Set IDs
      externalID: orderData.ids.external,
      customerID: customerId,
      // Set deadline date
      deadlineDate: orderData.orderDates.deadline,
      library: orderData.library,
      serviceType: orderData.serviceType,
    };

    // Set options
    if (isDefined(orderData.options)) {
      newOrderCreationDescription.options = orderData.options;
    }

    // Set priority
    if (isDefined(orderData.priority)) {
      switch (orderData.priority) {
        case OrderPriorityEnum.Highest:
          newOrderCreationDescription.priority = 15;
          break;

        case OrderPriorityEnum.High:
          newOrderCreationDescription.priority = 12;
          break;

        case OrderPriorityEnum.Medium:
          newOrderCreationDescription.priority = 9;
          break;

        case OrderPriorityEnum.Low:
          newOrderCreationDescription.priority = 6;
          break;

        case OrderPriorityEnum.Lowest:
          newOrderCreationDescription.priority = 3;
          break;
      }
    }

    // Set floors
    if (isDefined(orderData.floors)) {
      newOrderCreationDescription.floors = this.parseToOrderFloorCollectionDescription(orderData.floors);
    }

    // Attachments
    if (isDefined(attachments)) {

      // Set logo
      if (isDefined(attachments.logo) && attachments.logo.length) {
        newOrderCreationDescription.options.logo = this.parseToExternalFileDescription(attachments.logo[0]);
      }

      // Set watermark
      if (isDefined(attachments.watermark) && attachments.watermark.length) {
        newOrderCreationDescription.options.waterMark = this.parseToExternalFileDescription(attachments.watermark[0]);
      }

      // Set attachments
      if (isDefined(attachments.files) && attachments.files.length) {
        newOrderCreationDescription.attachments = attachments.files.map((file: ICloudFileDescription) => this.parseToExternalFileDescription(file));
      }
    }

    return newOrderCreationDescription;
  }

  private parseToOrderEditionDescription(orderData: IEditOrderIntent,
    attachments?: { logo: ICloudFileDescription, watermark: ICloudFileDescription, files: ICloudFileDescription[] }): IOrderEditionDescription {

    const editOrderDescription: IOrderEditionDescription = {

      serviceType: orderData.changedOrderData.serviceType,
      customerID: orderData.customerId,
      library: orderData.changedOrderData.library,
      deadlineDate: orderData.changedOrderData.orderDates.deadline,
      options: orderData.changedOrderData.options
    };

    // Set priority
    if (isDefined(orderData.changedOrderData.priority)) {
      switch (orderData.changedOrderData.priority) {
        case OrderPriorityEnum.Highest:
          editOrderDescription.priority = 15;
          break;

        case OrderPriorityEnum.High:
          editOrderDescription.priority = 12;
          break;

        case OrderPriorityEnum.Medium:
          editOrderDescription.priority = 9;
          break;

        case OrderPriorityEnum.Low:
          editOrderDescription.priority = 6;
          break;

        case OrderPriorityEnum.Lowest:
          editOrderDescription.priority = 3;
          break;
      }
    }

    // Set floors
    if (isDefined(orderData.newFloors) && orderData.newFloors.length) {
      editOrderDescription.floors = this.parseToOrderFloorCollectionDescription(orderData.newFloors);
    }

    // Set attachments
    if (isDefined(orderData.changedOrderData.attachments) && orderData.changedOrderData.attachments.length) {
      editOrderDescription.attachments = orderData.changedOrderData.attachments.map((file: CloudFile) => this.parseToExternalFileDescription(this.parseToCloudFileDescription(file), true));

      if (isDefined(attachments) && isDefined(attachments.files) && attachments.files.length) {
        editOrderDescription.attachments = [
          ...editOrderDescription.attachments,
          ...attachments.files.map((file: ICloudFileDescription) => this.parseToExternalFileDescription(file, true))
        ];
      }
    } else if (isDefined(attachments) && isDefined(attachments.files) && attachments.files.length) {
      editOrderDescription.attachments = attachments.files.map((file: ICloudFileDescription) => this.parseToExternalFileDescription(file, true));
    }

    // Set Logo
    if (isDefined(orderData.changedOrderData.options.logo)) {
      editOrderDescription.options.logo = this.parseToExternalFileDescription(this.parseToCloudFileDescription(orderData.changedOrderData.options.logo), true);
    } else if (isDefined(attachments) && isDefined(attachments.logo)) {
      editOrderDescription.options.logo = this.parseToExternalFileDescription(attachments.logo, true);
    }

    // Set Watermark
    if (isDefined(orderData.changedOrderData.options.waterMark)) {
      editOrderDescription.options.waterMark = this.parseToExternalFileDescription(this.parseToCloudFileDescription(orderData.changedOrderData.options.waterMark), true);
    } else if (isDefined(attachments) && isDefined(attachments.watermark)) {
      editOrderDescription.options.waterMark = this.parseToExternalFileDescription(attachments.watermark, true);
    }

    return editOrderDescription;
  }

}
