import MessageListItem from '../components/MessageListItem'
import { useState, useRef, useEffect } from 'react'
import { Message, getMessages } from '../data/messages'
import {
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
  IonRow,
  IonTitle,
  IonToolbar,
  IonCheckbox,
  useIonViewWillEnter,
  IonButton,
  IonModal
} from '@ionic/react'
import './Home.css'
import EconoLogo from '../assets/econo-logo+text.png'
import { cameraOutline, chevronDownOutline, chevronUpOutline, close } from 'ionicons/icons'
import { BrowserMultiFormatReader } from '@zxing/library'
import NadaAqui from '../assets/nada-aqui.png'

const Home: React.FC = () => {

  const [messages, setMessages] = useState<Message[]>([])
  const [totalv, setTotalv] = useState(0.00)

  const videoRef = useRef<HTMLVideoElement>(null)
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null)
  const isCameraStarted = useRef(false)

  const [camView, setCamView] = useState<boolean>(false)

  type ProductsObjArr = {
    nome: string,
    qnt: number,
    barCodeValue: string,
    price: number,
    checked: boolean
  }

  const [userProducts, setProducts] = useState<ProductsObjArr[]>([
    { nome: 'Banana Maçã', qnt: 1, barCodeValue: "7894721938452", price: 10.00, checked: false },
    { nome: 'Bala', qnt: 5, barCodeValue: "7896502813746", price: 0.50, checked: false },
    { nome: 'Arroz', qnt: 1, barCodeValue: "7891039482759", price: 25.00, checked: false },
    { nome: 'Feijão', qnt: 1, barCodeValue: "7898246501937", price: 15.00, checked: false },
  ]);

  const products = [
    { nome: 'Banana Maçã', qnt: 1, barCodeValue: "7894721938452", price: 10.00, checked: false },
    { nome: 'Bala', qnt: 5, barCodeValue: "7896502813746", price: 0.50, checked: false },
    { nome: 'Arroz', qnt: 1, barCodeValue: "7891039482759", price: 25.00, checked: false },
    { nome: 'Feijão', qnt: 1, barCodeValue: "7898246501937", price: 15.00, checked: false },
    { nome: 'Torradas Bauduco', qnt: 1, barCodeValue: "7891962053189", price: 15.00, checked: false}
  ]

  // Inicializa câmera apenas uma vez
  useEffect(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Seu navegador não suporta acesso à câmera. Use Chrome ou Firefox.")
      return
    }

    codeReaderRef.current = new BrowserMultiFormatReader();

    const startCamera = async () => {
      if (!videoRef.current || isCameraStarted.current) return

      try {
        const stream = await navigator.mediaDevices.getUserMedia(
          { video: {
             facingMode: "environment",
              width: { ideal: 1280 },
              height: { ideal: 720 } 
          } });
        videoRef.current.srcObject = stream

        await new Promise<void>(resolve => {
          videoRef.current!.onloadedmetadata = () => resolve()
        });

        videoRef.current.muted = true
        videoRef.current.playsInline = true
        await videoRef.current.play()

        isCameraStarted.current = true
      } catch (err) {
        console.error("Erro ao acessar câmera:", err)
      }
    };

    startCamera()

    return () => {
      codeReaderRef.current?.reset();
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop())
      }
    };
  }, [camView]);

  // Função do botão para ler um código de barras
  const handleScan = async () => {
    if (!videoRef.current || !codeReaderRef.current) return

    try {
      const reader = codeReaderRef.current!;
      const result = await reader.decodeOnceFromVideoDevice(undefined, videoRef.current)
      if (result) {
        console.log("Código detectado:", result.getText())
        getProduct(result.getText())
      }
    } catch (err) {
      console.log("Código não detectado, tente novamente")
    }
  };

  const getProduct = (barcode: string) => {
    const produtoEncontrado = products.find(product => product.barCodeValue === barcode);
    if (produtoEncontrado) {
      console.log(produtoEncontrado)
      setProducts([...userProducts, produtoEncontrado])
      alert(`Produto detectado: ${produtoEncontrado.nome} - R$ ${produtoEncontrado.price.toFixed(2)}`)
      setCamView(false)
    } else {
      console.error("Este código de barra não está cadastrado no banco de dados.")
    }
  };

  useEffect(() => {
    if (userProducts.length < 1 && userProducts) return
    const total = userProducts.reduce((acc, p) => p.checked ? acc + p.price * p.qnt : acc, 0)
    setTotalv(total)
  }, [userProducts])

  const selectAll = (check: boolean) => {

      const allProducts = userProducts.map((product, i) => {  
        return { ...product,
           checked: check ? true : false
          }
      })
      setProducts(allProducts)
  }
  
  const changeQnt = (index: number, operacao: string) => {
    
    const novosProdutos = userProducts.map((product, i) => {
      if (i === index) {
        let qnt = product.qnt
        if (operacao === 'menos' && qnt > 0) qnt--
        if (operacao === 'mais') qnt++
        return { ...product, qnt }
      }
      return product
    });
    setProducts(novosProdutos)
  }


  useIonViewWillEnter(() => {
    const msgs = getMessages();
    setMessages(msgs);
  });

  return (
    <IonPage id="home-page">
        <IonHeader>
          <IonToolbar className='flex row px-25'>
            <img src={EconoLogo} width={175} className='flex center' style={{ margin: '15px' }} />
            <IonIcon slot='end' className='interactive' icon={cameraOutline} onClick={() => setCamView((prev) => prev === true ? false : true)} size='large' />
          </IonToolbar>
        </IonHeader>

        <IonModal className="cam-modal" isOpen={camView} onDidDismiss={() => setCamView(false)} backdropDismiss={false}>
            <IonToolbar className='flex row toolbar-background'>
              <IonIcon icon={close} slot='end' className='interactive' size='large' onClick={() => setCamView(false)}></IonIcon>
            </IonToolbar>
            <div className='camLayout' style={{ backgroundColor: 'transparent'}}>
            <div className='camWrapper flex center col'>
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              style={{ border: '2px solid black' }}
            />
            </div> 
            <IonButton onClick={handleScan} style={{ marginBottom: '20px' }} >Escanear</IonButton>
            </div>
        </IonModal>
        
        

        <IonContent fullscreen>
          
          <IonList className='container bordered'>
            <IonListHeader className='title'> Seus Produtos </IonListHeader>
            <IonCheckbox className='inner-container' style={{ marginLeft: '50px' }} labelPlacement='end' onIonChange={(e) => selectAll(e.target.checked)}> Todos os produtos </IonCheckbox>

            <hr style={{ display: 'flex', width: '95%', backgroundColor: '#E6E6E6', marginBottom: '50px', marginTop: '15px' }} />

            {userProducts.length >= 1 &&
              <div>
                <IonGrid>
                  <IonRow>
                    <IonCol size='5'> <label style={ { marginLeft: '40px'}}> Nome </label> </IonCol>
                    <IonCol size='2' className='ion-text-center'> Quantidade/Kg's </IonCol>
                    <IonCol className='ion-text-end' size='4'> <label style={ { marginRight: '15px'}}> Preço (R$) </label> </IonCol>
                  </IonRow>
                </IonGrid>
                {userProducts && userProducts.map((product, index) => (
                  <IonItem key={index} lines="full" className="product inner-container">
                    <IonGrid>
                      <IonRow className="ion-align-items-center">

                        <IonCol size="6">
                          <IonCheckbox
                            labelPlacement="end"
                            checked={product.checked}
                            onIonChange={(e) => {
                              const novosProdutos = userProducts.map((p, i) => i === index ? { ...p, checked: e.detail.checked } : p);
                              setProducts(novosProdutos);
                            }}
                          >
                            {product.nome}
                          </IonCheckbox>
                        </IonCol>

                        <IonCol size="3" className="ion-text-center" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                          <IonIcon className='interactive' size='large' icon={chevronUpOutline} onClick={() => changeQnt(index, "mais")}></IonIcon>
                          <label style={ { margin: '0px 15px'}}> {product.qnt} </label>
                          <IonIcon className='interactive' size='large' icon={chevronDownOutline} onClick={() => changeQnt(index, "menos")}></IonIcon>
                        </IonCol>
                          

                        <IonCol size="2" className="ion-text-end">
                          {(product.price * product.qnt).toFixed(2)}
                        </IonCol>

                        <IonCol className='ion-text-end'>
                          <IonIcon className='interactive' size='large' icon={close} onClick={() => setProducts(userProducts.filter(p => p.nome !== product.nome))}></IonIcon>
                        </IonCol>
                      </IonRow>
                    </IonGrid>
                  </IonItem>
                ))}
                <IonItem lines='full' className='inner-container title'> Total <span slot='end'> {totalv.toFixed(2)} </span> </IonItem>
            </div>
            }

            {userProducts.length < 1 && 
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', marginBottom: '150px', marginTop: '150px', textAlign: 'center'}}>
                <h1 style={ { color: '#b4b4b4'}}> Não tem nada por aqui... </h1>
                <img src={NadaAqui} style={ { opacity: '0.75'}} className='center'/>
                <h2 style={ { color: '#b4b4b4'}}> Adicione produtos escaneando códigos de barra</h2>
                <p style={ { color: '#b4b4b4'}}> Clique no ícone da câmera para escanear códigos</p>
              </div>
            }


            

          </IonList>
        </IonContent>


      <IonFooter className='footer' style={{ padding: '50px', backgroundColor: '#075485' }}>
        <IonTitle slot='start'> O aplicativo faz apenas uma <span style={{ color: '#3CB74F', textDecoration: 'underline' }}> ESTIMATIVA</span> do preço total </IonTitle>
        <IonTitle slot='end'> © Todos os Direitos Reservados Rodrigo e Flavio</IonTitle>
      </IonFooter>
    </IonPage>
  );
};

export default Home;