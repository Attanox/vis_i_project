# Visualization report

Project can be visited [here](https://tender-heyrovsky-69e303.netlify.app/).

## Data source

This project visualizes data from **world happiness report** dataset, which holds happiness scores for each of the world's countries for years 2015-2019. Dataset can be found on [Kaggle](https://www.kaggle.com/unsdsn/world-happiness). Besides happiness scores each country has assigned rank and scores in areas like economy, family, freedom, etc. Areas make up main happiness score mentioned earlier.

## Preprocessing

Firstly, I got rid of empty values, which I did with replacing these empty values with average value.

Python code snippet:

```
import csv

def clean(item, average):
  result = item
  try:
    float(item)
  except:
    result = average
  return result

def getValue(item):
  try:
    return float(item)
  except:
    return 0.000


def preprocess(inputPath, outputPath, correctColIdx):
  with open(inputPath,'r') as csvSuminput:
    with open(inputPath, 'r') as csvCleanInput:
      with open(outputPath, 'w') as csvoutput:
          writer = csv.writer(csvoutput, lineterminator='\n')
          sumReader = csv.reader(csvSuminput)
          cleanReader = csv.reader(csvCleanInput)

          all = []
          headerRow = next(cleanReader)
          # append header
          all.append(headerRow)

          sums = []
          rows = 0


          for row in sumReader:
            print(row)
            for idx, item in enumerate(row):
              if len(sums) < idx + 1:
                sums.append(0.0)
              sums[idx] = sums[idx] + getValue(item)
            rows = rows + 1

          for row in cleanReader:
            print(row)
            for idx, item in enumerate(row):
              # do not change first n columns
              if idx >= correctColIdx:
                # set average
                row[idx] = clean(item, sums[idx] / rows)
              else:
                row[idx] = item
            all.append(row)

          writer.writerows(all)

preprocess('./2015.csv','./2015_preprocessed.csv', 3)
preprocess('./2016.csv','./2016_preprocessed.csv', 3)
preprocess('./2017.csv','./2017_preprocessed.csv', 2)
preprocess('./2018.csv','./2018_preprocessed.csv', 2)
preprocess('./2019.csv','./2019_preprocessed.csv', 2)
```

Another issue was, that years 2018 and 2019 don't have value **Dystopia Residual**, which, together with other values in particular areas, factors up main happiness score. Luckily it was easily compute with simple substraction and addition via following code snippet:

```
import csv

def c2f(item):
  try:
    return float("{0:.3f}".format(float(item)))
  except:
    return -1.000

def convert(inputPath, outputPath):
  with open(inputPath,'r') as csvinput:
    with open(outputPath, 'w') as csvoutput:
        writer = csv.writer(csvoutput, lineterminator='\n')
        reader = csv.reader(csvinput)

        all = []
        row = next(reader)
        row.append('Dystopia Residual')
        all.append(row)

        for row in reader:
            rest_sum = (c2f(row[3]) + c2f(row[4]) + c2f(row[5]) + c2f(row[6]) + c2f(row[7]) + c2f(row[8]))
            dystopia =  c2f(row[2]) - rest_sum
            row.append(dystopia)
            all.append(row)

        writer.writerows(all)

convert('./2018_preprocessed.csv','./2018_modified.csv')
convert('./2019_preprocessed.csv','./2019_modified.csv')
```

Some years there is no record for certain countries, which can be seen by white polygon on map, while there is selected year.

Also, some manual preprocessing was done, because polygons in GeoJSON format have as one of the properties name of state, but sometimes it didn't match with happiness report dataset names, so I just manually changed it.

## Visualization methods and interactions

When it came to visualizing countries immediate and obvious choice was using choropleth map. Polygons representing states are colored depending on main happiness score. User can zoom in and out and pan to navigate. When hovering over polygons, pop-up with state name and happiness score appears. Upon clicking polygon, two other diagrams will appear on right handside. One of them is barchart, which displays column for each year, when happiness score was recorded. Clicking on bar will affect piechart below. Piechart displays components of happiness score. Those are values like economy, family, etc.

## Observations

Happiest countries, across the board, are Canada, U.S.A, Australia, Finland, Sweden, Norway, Denmark, Netherlands and Switzerland. Their main happiness score is over 7.

On contrary, not so happy country are mainly countries in Africa. Countries here average value around 4.

Main difference we can observe between these two categories is that people in happy countries tend to score Economy, Family and Health equally. In less happy countries this distribution isn't equal, usually people here rate family higher than other areas.
