from backend.server import generate_schema

if __name__ == '__main__':
    data = {
        "type": "fdc3.instrument",
        "name": "Microsoft",
        "id": {
            "ticker": "MSFT"
        }
    }

    data2 = {"type": "abc"}

    schema = generate_schema(data2)
    print(schema)
