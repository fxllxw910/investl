
import React, { useState } from 'react';
import { MainLayout } from "@/components/layout/main-layout";
import { Container } from "@/components/ui/container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Send, Upload, Users } from "lucide-react";


interface Partner {
  id: number;
  name: string;
  logo: string;
  website?: string;
}

export default function PartnersPage() {
  const [partnershipForm, setPartnershipForm] = useState({
    companyName: '',
    contactPerson: '',
    phone: '',
    email: '',
    proposal: null as File | null,
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPartnershipForm(prev => ({
        ...prev,
        proposal: e.target.files![0]
      }));
    }
  };

  const handleSubmitPartnership = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!partnershipForm.companyName || !partnershipForm.contactPerson || !partnershipForm.phone || !partnershipForm.email || !partnershipForm.proposal) {
      alert('Пожалуйста, заполните все обязательные поля и прикрепите коммерческое предложение');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('companyName', partnershipForm.companyName);
      formData.append('contactPerson', partnershipForm.contactPerson);
      formData.append('phone', partnershipForm.phone);
      formData.append('email', partnershipForm.email);
      formData.append('description', partnershipForm.description);
      formData.append('proposal', partnershipForm.proposal);

      const response = await fetch('/api/send-partnership', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        alert('Ваше коммерческое предложение успешно отправлено!');
        setPartnershipForm({
          companyName: '',
          contactPerson: '',
          phone: '',
          email: '',
          proposal: null,
          description: ''
        });
        setIsDialogOpen(false);
      } else {
        alert('Произошла ошибка при отправке предложения. Пожалуйста, попробуйте еще раз.');
      }
    } catch (error) {
      console.error('Error sending partnership proposal:', error);
      alert('Произошла ошибка при отправке предложения. Пожалуйста, попробуйте еще раз.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Партнеры - транспорт
  const transportPartners: Partner[] = [
    { id: 1, name: "ООО «РБА-Челябинск»", logo: "https://investl.ru/upload/iblock/23b/32f48sisfs82qma8o03wuy3ryxc83ow1.png", website: "http://www.rbauto.ru/" },
    { id: 2, name: "ОАО «ЧКПЗ»", logo: "https://investl.ru/upload/iblock/7d0/gjrqudrjzha22z7tuapvejnd9l3kox57.jpg", website: "https://www.chkpz.ru/catalog/cat7/" },
    { id: 3, name: "ЗАО «Интертранссервис»", logo: "https://investl.ru/upload/iblock/bda/wcjh3umlcqg90bkxo341yp7lt7qys2dm.png", website: "http://intertransservice.ru/" },
    { id: 4, name: "ООО ТСК «УралПромИнвест»", logo: "https://investl.ru/upload/iblock/55b/3vfrdbcxfrniafgaa0zfmyuwz8ph1z72.png", website: "http://www.ural-beton.ru/" },
    { id: 5, name: "ООО «Гирд-Автофургон»", logo: "https://investl.ru/upload/iblock/4c2/s3n9ouhdpcm4qkjy1ritytzaz8upv0cl.png", website: "http://gird.ru/" },
    { id: 6, name: "ООО «Акцент-Авто М»", logo: "https://investl.ru/upload/iblock/5fc/pya3593mfqlhzeprawjqvyofmlnolwok.png", website: "https://avtovek.lada.ru/" },
    { id: 7, name: "Группа компаний «Грузовая Техника»", logo: "https://investl.ru/upload/iblock/18b/25112p55d4965w2q4z34umj6qt6xk1zc.png", website: "http://gruz-tehnika.ru/" },
    { id: 8, name: "ООО «Спецмаш»", logo: "https://investl.ru/upload/iblock/9cc/wssn48kfxwv68o0k43r4wopljbd1wiri.png", website: "http://autospecmash.ru/" },
    { id: 9, name: "ЛБР-Агромаркет", logo: "https://investl.ru/upload/iblock/2c6/40ctwrfq8u52v3j3cafhdl802s1vkax6.png", website: "http://www.lbr.ru/" },
    { id: 10, name: "ООО ПКФ «Политранс»", logo: "https://investl.ru/upload/iblock/0b4/z4uaf7mlwnx4xy6bymg7h9xsuwvfef62.png", website: "http://www.politrans.ru/" },
    { id: 11, name: "ООО «Русь-Агро»", logo: "https://investl.ru/upload/iblock/ac9/822884uk7fv8mrhnay5g3k4ws8smuqiv.png", website: "http://www.rusagro74.ru/" },
    { id: 12, name: "ЛУИДОР", logo: "https://investl.ru/upload/iblock/1dd/2chdrspgybc05mnt0iyg088e5stdtayw.png", website: "http://luidor-chel.ru/" },
    { id: 13, name: "ООО «Южуралпогрузчик»", logo: "https://investl.ru/upload/iblock/977/ts686ab2ys981t8wo24nq0juq6b4sbgu.png", website: "http://uralforklift.ru/" },
    { id: 14, name: "ООО «ТехВосток»", logo: "https://investl.ru/upload/iblock/fb1/ls05oh0ns2m8inpesuh4ohe9t0a4htqr.png", website: "http://lgmg-mt.ru/" },
    { id: 15, name: "«Грузовики и Спецтехника»", logo: "https://investl.ru/upload/iblock/eed/hqcue1bt914jot3hyj08510rfnxrmc3p.png", website: "https://tdgis.ru/" },
    { id: 16, name: "Тюменский завод мобильных зданий", logo: "https://investl.ru/upload/iblock/f7d/nyrm1mrahpwpoudch28xpc125hwrjthc.png", website: "https://toir.ru/" },
    { id: 17, name: "ИнтехКранСервис", logo: "https://investl.ru/upload/iblock/094/kcok0h93ulbnnfwl3c3j8e1sv515w56l.png", website: "http://intexkran.ru/" },
  ];

  // Партнеры - оборудование
  const equipmentPartners: Partner[] = [
    { id: 1, name: "Компания nanxing", logo: "https://investl.ru/upload/iblock/629/2jwteli6km3enszslcn40z4gfchklreb.png", website: "http://nanxing.ru/" },
    { id: 2, name: "Корпорация DMTG", logo: "https://investl.ru/upload/iblock/303/cn1y6esmtwpf1tyorkobyq401knpbykw.png", website: "http://dmtg-stanki.ru/" },
    { id: 3, name: "КМТ", logo: "https://investl.ru/upload/iblock/0e8/w0kg81sbwuv2ur2sz8tmlpxsyjcrwt8a.png", website: "http://kmt-stanki.ru/" },
    { id: 4, name: "ВесТэк", logo: "https://investl.ru/upload/iblock/3c7/7ry7wsbsn1jyyid5kq5qxmde2rrmkmkn.png", website: "https://zvtvestek.ru/" },
    { id: 5, name: "Мир станков", logo: "https://investl.ru/upload/iblock/493/0rxbgzefx84r3vv11sm3m9rjdcvj7bhf.png", website: "http://mir-stankov.ru/" },
    { id: 6, name: "КАМИ", logo: "https://investl.ru/upload/iblock/327/i9sw1uuet29lf0zccs5l0d411pmprtca.png", website: "http://stanki.ru/" },
    { id: 7, name: "ООО «Афалина Челябинск»", logo: "https://investl.ru/upload/iblock/441/68b5kbccr1h79rr3br1rtiz8trfztvwi.png", website: "http://afalina.com/" },
    { id: 8, name: "ООО «Генерационное оборудование»", logo: "https://investl.ru/upload/iblock/a1b/0bmusjuoh7mee387ez8eai64nc8ds5et.jpg", website: "http://qlaster.ru/" },
    { id: 9, name: "ЗАЩ «Газовик-ПРО»", logo: "https://investl.ru/upload/iblock/6b6/0t13a4d15mr5ddlxghr4170t4h7pyedu.jpg", website: "http://gazovik-pro.ru/" },
    { id: 10, name: "ООО «Энергия пара»", logo: "https://investl.ru/upload/iblock/707/bhv9rwjh02qwsics4lztym4zko01af6u.png", website: "http://www.par-ma.ru/" },
    { id: 11, name: "ООО «Солдрим-СПб»", logo: "https://investl.ru/upload/iblock/d4a/2bb8w8nxmmhoxhg107n1cpsvys6vuq5d.png", website: "http://soldream-spb.com/" },
    { id: 12, name: "ООО «МонолитЦентр»", logo: "https://investl.ru/upload/iblock/594/00rinyiyyj7eor3pehu3pegbzfz68g3c.jpg", website: "http://www.monolitural.ru/" },
    { id: 13, name: "ООО «Аланта»", logo: "https://investl.ru/upload/iblock/f20/6xln1s86w7jvwo23oyrnh5cwsnbcejk6.png", website: "http://www.alanta.ru/" },
    { id: 14, name: "ООО «Челябкомпрессор»", logo: "https://investl.ru/upload/iblock/236/recvzc8caff9fsusvyxb2nr7hs9yg7o2.jpg", website: "http://www.kompressorov.ru/" },
    { id: 15, name: "ООО «Торгово Промышленный Альянс»", logo: "https://investl.ru/upload/iblock/2d1/nuy1583hhvxfmpq8p5t9d5527zu5hok2.jpg", website: "http://www.rosalliance.ru/" },
    { id: 16, name: "РусАвтоматизация", logo: "https://investl.ru/upload/iblock/c9b/gaoj734tnwvp3q32i4slbw71403kbs71.jpg", website: "http://rusautomation.ru/" },
    { id: 17, name: "ООО «РОКТЭС»", logo: "https://investl.ru/upload/iblock/64b/wo9vbesrk604zr2s1ift0804wc4bds6c.jpg", website: "http://www.roktes.ru/" },
    { id: 18, name: "ООО «Уралпромтехника»", logo: "https://investl.ru/upload/iblock/5eb/k26woguq169ugnrlmub9l774adhnt2yb.png", website: "http://www.uralpromteh.ru/" },
    { id: 19, name: "Завод «Стройтехника»", logo: "https://investl.ru/upload/iblock/453/s2bccalp5i08jkvxf1b3rtzusou0qctj.png", website: "http://stroytec.ru/" },
    { id: 20, name: "ООО «Сталь-Максимум»", logo: "https://investl.ru/upload/iblock/a8a/c9s1welh6ywry8g0rpml3y3f8ojunksf.png", website: "http://stalmaximum.ru/" },
    { id: 21, name: "ООО «Лазер Мастер»", logo: "https://investl.ru/upload/iblock/893/adrjb5qgd2ua1xysmme60772t1ifpipt.png", website: "https://lazermaster.ru/" },
    { id: 22, name: "ООО «АМПЛИТУДА»", logo: "https://investl.ru/upload/iblock/74d/dcngf5io4hbvmq4p4wobc0uclokvsiqv.png", website: "https://eapack.ru/" },
    { id: 23, name: "Ledel", logo: "https://investl.ru/upload/iblock/b05/5bit1yxw1m3o5b3esz4lnu6anusma0lh.png", website: "http://ledel.ru/" },
    { id: 24, name: "ООО «НПК Групп»", logo: "https://investl.ru/upload/iblock/674/o0ilyoc9aiooah7cxz327wfktbft8vz1.png", website: "https://prkom.ru/" },
    { id: 25, name: "АО «Сибшванк»", logo: "https://investl.ru/upload/iblock/1e1/7uxeluv4rh1bbnmdifbgsqzk3flkiul6.png", website: "https://www.schwank.ru/" },
    { id: 26, name: "ООО «Энергостан»", logo: "https://investl.ru/upload/iblock/41b/mo0x0pdyud0atw70150aljstnypl2zvy.png", website: "https://www.energostan.ru/" },
    { id: 27, name: "L-CON", logo: "https://investl.ru/upload/iblock/344/4l4pqh1om2x9surfc4hkilmxgsko9pvw.png", website: "https://l-con.ru/" },
    { id: 28, name: "ЭЛКОН", logo: "https://investl.ru/upload/iblock/ae9/8gwq02nc5nklk62ttzwl7u4ucn2g57r1.png", website: "https://www.elkon.ru/" },
    { id: 29, name: "Группа компаний БРИЗ", logo: "https://investl.ru/upload/iblock/04a/zadp7pe2w7p3kemua9oa2b81ke1xyyc1.png", website: "https://www.brise-group.ru/" },
    { id: 30, name: "«Завод Стройтехника» РИФЕЙ", logo: "https://investl.ru/upload/iblock/3b1/wjddv6k2n5jmm92vh5navbwr3unmz3ow.png", website: "https://stroytec.ru/" },
    { id: 31, name: "Завод «РИР-Стандарт»", logo: "https://investl.ru/upload/iblock/1ee/1waupi2efdst5jiy9xe3foqeu6m57ys8.png", website: "https://rir-standart.ru/" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <MainLayout>
      <section className="py-20 relative">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-6">Партнёры</h1>
            <p className="text-muted-foreground text-lg">
              Мы сотрудничаем с ведущими поставщиками автотранспорта и оборудования
            </p>
          </div>
          
          <div className="max-w-6xl mx-auto">
            <Tabs defaultValue="transport" className="mb-12">
              <div className="flex justify-center mb-12">
                <TabsList>
                  <TabsTrigger value="transport">Транспорт</TabsTrigger>
                  <TabsTrigger value="equipment">Оборудование</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="transport">
                <motion.div 
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
                  initial="hidden"
                  animate="visible"
                  variants={containerVariants}
                >
                  {transportPartners.map((partner) => (
                    <motion.div 
                      key={partner.id}
                      variants={itemVariants}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="h-full">
                        <CardContent className="p-6 flex flex-col items-center justify-center h-full">
                          <a 
                            href={partner.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex flex-col items-center text-center"
                          >
                            <div className="h-20 flex items-center justify-center mb-4">
                              <img 
                                src={partner.logo} 
                                alt={partner.name} 
                                className="max-h-full max-w-full object-contain"
                              />
                            </div>
                            <h3 className="text-lg font-medium mt-4">{partner.name}</h3>
                          </a>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              </TabsContent>
              
              <TabsContent value="equipment">
                <motion.div 
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-6"
                  initial="hidden"
                  animate="visible"
                  variants={containerVariants}
                >
                  {equipmentPartners.map((partner) => (
                    <motion.div 
                      key={partner.id}
                      variants={itemVariants}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="h-full">
                        <CardContent className="p-6 flex flex-col items-center justify-center h-full">
                          <a 
                            href={partner.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex flex-col items-center text-center"
                          >
                            <div className="h-20 flex items-center justify-center mb-4">
                              <img 
                                src={partner.logo} 
                                alt={partner.name} 
                                className="max-h-full max-w-full object-contain"
                              />
                            </div>
                            <h3 className="text-lg font-medium mt-4">{partner.name}</h3>
                          </a>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              </TabsContent>
            </Tabs>
            
            <div className="mt-16 text-center">
              <h2 className="text-2xl font-bold mb-6">Станьте нашим партнером</h2>
              <p className="text-muted-foreground text-lg max-w-3xl mx-auto mb-8">
                Мы открыты для сотрудничества с поставщиками автотранспорта, спецтехники и оборудования. 
                Предлагаем выгодные условия и индивидуальный подход к каждому партнеру.
              </p>
              
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="text-lg px-8 py-4">
                    <Users className="mr-2 h-5 w-5" />
                    Стать партнером
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Заявка на партнерство</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmitPartnership} className="space-y-4">
                    <div>
                      <Label htmlFor="companyName">Название компании *</Label>
                      <Input
                        id="companyName"
                        value={partnershipForm.companyName}
                        onChange={(e) => setPartnershipForm(prev => ({
                          ...prev,
                          companyName: e.target.value
                        }))}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="contactPerson">Контактное лицо *</Label>
                      <Input
                        id="contactPerson"
                        value={partnershipForm.contactPerson}
                        onChange={(e) => setPartnershipForm(prev => ({
                          ...prev,
                          contactPerson: e.target.value
                        }))}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">Телефон *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={partnershipForm.phone}
                        onChange={(e) => setPartnershipForm(prev => ({
                          ...prev,
                          phone: e.target.value
                        }))}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={partnershipForm.email}
                        onChange={(e) => setPartnershipForm(prev => ({
                          ...prev,
                          email: e.target.value
                        }))}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Краткое описание деятельности</Label>
                      <Textarea
                        id="description"
                        value={partnershipForm.description}
                        onChange={(e) => setPartnershipForm(prev => ({
                          ...prev,
                          description: e.target.value
                        }))}
                        placeholder="Опишите вашу деятельность и предлагаемое сотрудничество"
                        rows={3}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="proposal">Коммерческое предложение *</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          id="proposal"
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileChange}
                          required
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById('proposal')?.click()}
                          className="w-full"
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          {partnershipForm.proposal ? partnershipForm.proposal.name : 'Выберите файл'}
                        </Button>
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Отправка...' : 'Отправить предложение'}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </Container>
      </section>
    </MainLayout>
  );
}
