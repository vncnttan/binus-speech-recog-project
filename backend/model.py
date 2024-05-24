import numpy as np
import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression

df = pd.read_csv('Salary_Data.csv')

X = df.iloc[:, :-1].values
y = df.iloc[:, -1].values

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=0)

regressor = LinearRegression()
regressor.fit(X_train, y_train)

def predict(X_pred):
    X_pred = np.array(X_pred).reshape(1, 1)
    y_pred = regressor.predict(X_pred)
    return y_pred[0]