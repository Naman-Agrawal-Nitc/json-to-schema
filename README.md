# JSON to JSON-SCHEMA CONVERTER (USING FLASK + REACT)

This project helps in converting json format to modified json-schema format, which can be 
used for adding projects in FDC3 application.

## Application URL : https://json-to-schema.onrender.com/


Note: This application is deployed on free version of render and  free instance can spin down with inactivity, which can delay requests by 50 seconds or more.


## Installation

Step-by-step instructions on how to set up the project locally.

- Clone the repository:
    ### `git clone https://github.com/Naman-Agrawal-Nitc/json-to-schema.git`

- Navigate to the backend of project directory:
    ### `cd json-to-schema/backend`

- Install dependencies:
    ### `pip install -r requirements.txt`

- Run the application
    ### `python server.py`

## Configurations
-  **PORT** : The port on which the server runs (default: 5000).

## Features

- This application converts json to modified json-schema, as per FDC3 standards.
  - The type field is mandatory.
  - Tiltle and Description fields are added wherever needed.
  - allOf, anyOf is added wherever needed.
  - examples are added for every schema.
  - "const" is used for type field.
- The "modify" option gives the flexibility to modify the json schema as per their need.
  - The default title and description can be modified by the user
  - Date, time, country code, currency code can be modified according to the FDC3 standards.
  - They can add other properties or the enum fields if required.
  - They can add $ref fields if required
  - They can add other fields in required category
- The user can copy the final json-schema to anywhere outside the application.
- The info icon will open the official documnetation for FDC3 standards.
- The schema which is created will be in preferred or suitable order, not in random order.
 
  
## Future Features
- The feature for converting the json-schema to typescript can be added in future changes.

## Additional links
- Example schema : https://github.com/finos/FDC3/blob/9605b158bcfc71f9077346dc3eed454225e7db4b/schemas/context/chart.schema.json
- Documentation of schema : https://fdc3.finos.org/docs/next/context/spec
- Tool for simple conversion: https://app.quicktype.io/