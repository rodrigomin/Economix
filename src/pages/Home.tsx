import MessageListItem from '../components/MessageListItem';
import { useState } from 'react';
import { Message, getMessages } from '../data/messages';
import {
  IonButton,
  IonCard,
  IonCheckbox,
  IonCol,
  IonContent,
  IonFooter,
  IonGrid,
  IonHeader,
  IonIcon,
  IonItem,
  IonList,
  IonListHeader,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonRow,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter
} from '@ionic/react';
import './Home.css';
import EconoLogo from '../assets/econo-logo+text.png'
import { camera, cameraOutline, chevronDownOutline, chevronUpOutline, mail } from 'ionicons/icons';

const Home: React.FC = () => {

  const [messages, setMessages] = useState<Message[]>([]);

  useIonViewWillEnter(() => {
    const msgs = getMessages();
    setMessages(msgs);
  });

  const refresh = (e: CustomEvent) => {
    setTimeout(() => {
      e.detail.complete();
    }, 3000);
  };

  const [totalv, setTotalv] = useState(0.00)

  const [products, setProducts] = useState([
    {
      nome: 'Banana Maçã',
      qnt: 1,
      barCodeValue: "7894721938452",
      price: 10.00
    },
    {
      nome: 'Bala',
      qnt: 5,
      barCodeValue: "7896502813746",
      price: 0.50
    },
    {
      nome: 'Arroz',
      qnt: 1,
      barCodeValue: "7891039482759",
      price: 25.00
    },
    {
      nome: 'Feijão',
      qnt: 1,
      barCodeValue: "7898246501937",
      price: 15.00
    }
  ])

  const total = (e: any, price: number, qnt: number) => {
    if (e.detail.checked) {
      setTotalv((prev) => prev + (price * qnt));
    } else {
      setTotalv((prev) => prev - (price * qnt));
    }
  };

  const changeQnt = (index : number, operacao : string) => {
    const novosProdutos = products.map((product, i) => {
      if (i === index) {
        if (operacao === 'menos' && product.qnt > 0) {
          return {
            ...product,
            qnt: product.qnt - 1
          }
        } if (operacao === 'mais') {
          return {
              ...product,
              qnt: product.qnt + 1
          }
        }
      }
      return product
    })
    setProducts(novosProdutos)
  }

  return (
    <IonPage id="home-page">
      <IonHeader>
        <IonToolbar className='flex row px-25' >
          <img src={EconoLogo} width={175} className='flex center' style={ { margin: '15px'}} />
          <IonIcon slot='end' className='interactive' icon={cameraOutline} size='large'></IonIcon>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
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
  );
};

export default Home;
