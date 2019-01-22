# MovieVeiwer
To run the project clone or download as ZIP and run with visual studio (it was tested on VS 2015 and VS 2017)

Neo4j Database Setup:
The project already connects to a ready Movie database, if you would like to connect to your own MovieDB:
- Open [Web.config](https://github.com/nasimsaleh/MovieVeiwer/blob/master/MovieVeiwer/Web.config) file and change the IP:Port and Creditionals of database as shown below

    ```sh
    <!-- Set IP:Port of Graph Database -->
    <add key="GraphDBUrl" value="http://{0}:{1}@[IP]:[PORT]/db/data"/>
   
    <!-- Set Username and Password for DB -->
    <add key="GraphDBUser" value="[Username]"/>
    <add key="GraphDBPassword" value="[Password]"/>
   ```
