import { NotificationType, RequestType } from 'vscode-languageserver';
import { SchemaAdditions, SchemaDeletions } from './languageservice/services/yamlSchemaService';

export namespace SchemaAssociationNotification {
    export const type: NotificationType<{ }, { }> = new NotificationType('json/schemaAssociations');
}

export namespace DynamicCustomSchemaRequestRegistration {
    export const type: NotificationType<{ }, { }> = new NotificationType('yaml/registerCustomSchemaRequest');
}

export namespace VSCodeContentRequest {
    export const type: RequestType<{ }, { }, { }, { }> = new RequestType('vscode/content');
}

export namespace CustomSchemaContentRequest {
    export const type: RequestType<string, string, { }, { }> = new RequestType('custom/schema/content');
}

export namespace CustomSchemaRequest {
    export const type: RequestType<string, string | string[], { }, { }> = new RequestType('custom/schema/request');
}

export namespace ColorSymbolRequest {
    export const type: RequestType<{ }, { }, { }, { }> = new RequestType('json/colorSymbols');
}

export namespace SchemaModificationNotification {
    export const type: RequestType<SchemaAdditions | SchemaDeletions, void, { }, { }> = new RequestType('json/schema/modify');
}

export namespace CustomSchemaStoreRequest {
    export const type: RequestType<string, string, { }, { }> = new RequestType('custom/schema/store');
}