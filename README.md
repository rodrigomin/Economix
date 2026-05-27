# ECONOMIX: O App que te ajuda a economizar no supermercado!
Objetivo

<p align="center">
  <img src="./src/assets/econo-logo+text.png" width="300"/>
</p>

---

A ideia é bem simples. Existem os supermercados parceiros que permitem o uso do banco de dados com os preços dos produtos e nós o conectamos com o aplicativo.  
Após isso, tudo que o usuário tem que fazer é scanear o código de barra de determinado produto e deixar o aplicativo calcular o preço total. Assim o usuário pode ponderar seus gastos e ser consciente no supermercado.

Este projeto é benéfico tanto para o usuário quanto para os colaboradores, já que é um diferencial no mercado. E quando se trata de um empreendedorismo como este, o que não falta são mercados iguais, portanto, o diferencial da parceria com o nosso aplicativo se torna crucial para a captação de novos clientes.

---

# Arquitetura do sistema
<p>
  
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">
              Inbox
            </IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonList>
          {messages.map(m => <MessageListItem key={m.id} message={m} />)}
        <IonList className='container bordered'>
          <IonListHeader className='title'> Seus Produtos 
          </IonListHeader>
          <IonCheckbox className='inner-container' style={ { marginLeft: '50px'} } labelPlacement='end'> Todos os produtos </IonCheckbox>

          {products.map((product, index) => (
            <IonItem key={index} lines="full" className="product inner-container">
              <IonGrid>
                <IonRow className="ion-align-items-center">

                  <IonCol size="6">
                    <IonCheckbox
                      labelPlacement="end"
                      onIonChange={(e) => total(e, product.price, product.qnt)}
                    >
                      {product.nome}
                    </IonCheckbox>
                  </IonCol>

                  <IonCol size="3" className="ion-text-center" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <IonIcon className='interactive' size='large' icon={chevronUpOutline} onClick={() => changeQnt(index, "mais")}></IonIcon>
                    <label style={ { margin: '0px 15px'}}> {product.qnt} </label>
                    <IonIcon className='interactive' size='large' icon={chevronDownOutline} onClick={() => changeQnt(index, "menos")}></IonIcon>
                  </IonCol>
                  

                  <IonCol size="3" className="ion-text-end">
                    {(product.price * product.qnt).toFixed(2)}
                  </IonCol>

                </IonRow>
              </IonGrid>
            </IonItem>
          ))}

          <IonItem lines='full' className='inner-container title'> Total <span slot='end'> {totalv.toFixed(2)} </span> </IonItem>

        </IonList>
      </IonContent>

      <IonFooter className='flex row' style={ { padding: '50px', backgroundColor: '#075485'}}>
        <IonTitle slot='start'> O aplicativo faz apenas uma <span style={ { color: '#3CB74F', textDecoration: 'underline'}}> ESTIMATIVA</span> do preço total </IonTitle>
        <IonTitle slot='end'> © Todos os Direitos Reservados Rodrigo e Flavio</IonTitle>
      </IonFooter>
    </IonPage>

</p>
    
# Ferramentas Usadas

* Ionic + React
* Typescript
* Biblioteca "zxing" - para ler os códigos de barra

<br>
<div align="center">
  
| Ionic | React | zxing |
| :---: | :---: | :---:|
| <img src="./public/favicon.png" width="50"/> | <img src="./public/React-icon.png" width="50"/> | <img src="./public/barcode.png" width="50"/> 
 
 
 </div>

---


# Dependências
* Dispositivo movel com acesso a internet

* Baixar o Ionic (requer Node e npm)

  ## Windows
  ```
  npm i -g @ionic/cli
  ```

  ## Linux (Ubuntu)
  
  ```
  sudo npm install -g @ionic/cli
  ```

---

# Setup: PC -> Android

  - Instale o Android Studio;
    
  - Instale os SDK's padrão;
    
  - Entre na pasta do App;
    
  - Execute o código:
    
  ```
  ionic run build
  ```

  - Adicione o android com:
    
  ```
  npx cap add android
  ```

  - Sincronize tudo no Android Studio e depois abra
    
  ```
  npx cap sync
  npx cap open android
  ```

  - Conecte seu celular com o modo de Depuração Ligado && Instalação pela depuração (pode ser USB ou Wireless);
    
  - Selecione seu celular e clique em Run;

  - Espere instalar o App no celular.

---

# Erros que podem ocorrer

1. Demora na leitura por conta de iluminação e qualidade da câmera;
2. Também na criação do App para o Android -> É possível que ocorra um erro na versão do SDK (como aconteceu comigo), neste caso vá na pasta (pós npx cap android)
   
  ```
   ~/android/app/build.gradle
  ```

  E troque

  ```
  defaultConfig {
        applicationId "com.economix.app"
        minSdkVersion rootProject.ext.minSdkVersion
        targetSdkVersion rootProject.ext.targetSdkVersion...
  ```

  por

  ```
  defaultConfig {
        applicationId "com.economix.app"
        minSdkVersion 26
        targetSdkVersion rootProject.ext.targetSdkVersion...
  ```
