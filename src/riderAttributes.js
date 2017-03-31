import protobuf from 'protobufjs';

const proto = `syntax=\"proto3\";
    message Attributes {
        int32 f2 = 2;
        int32 f3 = 3;
        message AttributeMessage {
            int32 myId = 1;
            int32 theirId = 2;
            string firstName = 3;
            string lastName = 4;
            int32 countryCode = 5;
        }
        AttributeMessage attributeMessage = 4;
        int32 theirId = 10;
        int32 f13 = 13;
    }`;
const root = protobuf.parse(proto, { keepCase: true }).root;
const Attributes = root.lookup("Attributes");

export function decodeAttributes(buffer) {
    return Attributes.decode(buffer);
};

export function encodeAttributes(attributes) {
    return Attributes.encode(attributes).finish();
}
