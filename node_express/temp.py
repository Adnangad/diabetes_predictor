import pandas as pd
import json
import sys
import os
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report
from sqlalchemy import create_engine
from dotenv import load_dotenv

load_dotenv()
def make_prediction(data_pred):
    db_user = os.getenv("DB_USER")
    db_password = os.getenv("DB_PASSWORD")
    db_host = os.getenv("DB_HOST")
    db_name = os.getenv("DB_NAME")

    connection_string = f"mysql+mysqlconnector://{db_user}:{db_password}@{db_host}/{db_name}"
    engine = create_engine(connection_string)
    
    data = pd.read_sql_table("data_table", con=engine)
    data['gender'] = data['gender'].map({'M': 0, 'F': 1})

    X = data[['age', 'bmi', 'blood_sugar_level', 'gender']]
    y = data['outcome']

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.5, random_state=42)

    

    model = LogisticRegression(max_iter=1000)
    model.fit(X_train, y_train)

    data_pred = json.loads(data_pred)
    
    data_to_pred = pd.DataFrame.from_dict(data_pred)
    

    y_pred = model.predict(data_to_pred)
    return y_pred.tolist()

if __name__ == "__main__":
    try:
        input_data = json.loads(sys.stdin.read())  
        rez = make_prediction(input_data)

        print(json.dumps({"result": rez}))
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
