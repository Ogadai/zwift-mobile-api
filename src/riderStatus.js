import protobuf from 'protobufjs';

export default function riderStatus(buffer) {
    var root = protobuf.Root.fromJSON({
        nested: {
            Status: {
                fields: {
                    id: {
                        type: "int32",
                        id: 1
                    },
                    distance: {
                        type: "int32",
                        id: 3
                    },
                    speed: {
                        type: "int32",
                        id: 6
                    },
                    power: {
                        type: "int32",
                        id: 12
                    },
                    time: {
                        type: "int32",
                        id: 16
                    },
                    climbing: {
                        type: "int32",
                        id: 15
                    },
                    calories: {
                        type: "int32",
                        id: 24
                    },
                    f4: {
                        type: "int32",
                        id: 4
                    },
                    f8: {
                        type: "int32",
                        id: 8
                    },
                    f9: {
                        type: "int32",
                        id: 9
                    },
                    f13: {
                        type: "int32",
                        id: 13
                    },
                    f14: {
                        type: "int32",
                        id: 14
                    },
                    f19: {
                        type: "int32",
                        id: 19
                    },
                    f20: {
                        type: "int32",
                        id: 20
                    },
                    f21: {
                        type: "int32",
                        id: 21
                    }
                }
            }
        }
    });

    var Status = root.lookup("Status");
    return Status.decode(buffer);
};