import {
  Button,
  chakra,
  Container,
  Heading,
  Stack,
  Text,
  Image,
  Box,
  Grid
} from '@chakra-ui/react'
import SignupModal from 'components/auth'

const StartButton = (props: any) => {
  return (
    <SignupModal>
      <Button
        bgColor={props.bg}
        color={props.color}
        border={props.border}
        rounded="full"
        fontSize={{ base: '', md: '16px' }}
        size="md"
        px={{ base: '', md: '2rem' }}
        py={{ base: '', md: '1.8rem' }}
        alignSelf="flex-start"
      >
        Get Started
      </Button>
    </SignupModal>
  )
}

const Page = () => {
  return (
    <>
      <chakra.nav w="100%" pos="fixed" top="0" left="0" right="0" zIndex="2">
        <Stack
          py={{ base: '12px', md: '24px' }}
          px={{ base: '16px', md: '48px' }}
          direction="row"
          justify="space-between"
          align="center"
        >
          <Image src="/logo.svg" alt="logo" boxSize="40px" />
          <SignupModal>
            <Button
              bgColor="white"
              rounded="full"
              size={{ base: 'sm', md: 'md' }}
              color="#000"
            >
              Join now
            </Button>
          </SignupModal>
        </Stack>
      </chakra.nav>
      <Container maxW="100%" py="0" h="95vh" overflow="hidden">
        <Stack
          px={{ base: '12px', md: '8rem' }}
          pb={{ base: '16px', md: '6rem' }}
          pt={{ base: '16px', md: '6rem' }}
        >
          <Heading
            as="h1"
            fontStyle="normal"
            fontWeight="700"
            fontSize={{ base: '80px', md: '146px' }}
            whiteSpace="nowrap"
            color="#000"
            lineHeight={{ base: '188px', md: '197px' }}
            css={{
              '-webkit-text-stroke': '2px white',
              'text-stroke': '2px white'
            }}
          >
            Mediay
          </Heading>
        </Stack>

        <Stack
          bgImage="url(/images/bg_cover_image.png)"
          bgRepeat="no-repeat"
          bgSize="100%"
          // objectFit="cover"
          bgPos="center"
          px={{ base: '', md: '10rem' }}
          direction={{ base: 'column', md: 'row' }}
        >
          <Image
            src="images/hero_image_mediay.png"
            alt="mediay-app"
            boxSize="85%"
          />
          <Heading
            w="325px"
            fontFamily="General Sans"
            fontWeight="500"
            fontSize="48px"
            lineHeight="65px"
            textTransform="capitalize"
            opacity=" 0.98"
            position="relative"
            left={{ base: '0', md: '-4rem' }}
            top={{ base: '0', md: '-7.2rem' }}
          >
            The platform for group subscriptions.
          </Heading>
        </Stack>
      </Container>

      <chakra.section pos="relative" overflow="hidden">
        <Container
          maxW="100%"
          p="0"
          bgImage="url(/images/bg_section_2.png)"
          bgRepeat="no-repeat"
          bgSize="100%"
          // objectFit="cover"
          bgPos="center"
          // overflow="hidden"
          // h="80vh"
        >
          <Stack
            direction={{ base: 'column', md: 'row' }}
            spacing="0"
            align="center"
            justify="center"
          >
            <Stack
              position="relative"
              right={{ base: '', md: '-16rem' }}
              spacing={{ base: '', md: '6' }}
            >
              <Image
                src="images/create_groups.svg"
                alt="Create Groups"
                boxSize="90%"
                alignSelf="flex-start"
              />
              <Image
                src="images/share_subscriptions.svg"
                alt="Share Subscriptions"
                boxSize="100%"
              />
              <Image
                src="images/split_bills.svg"
                alt="Split Bills"
                boxSize="80%"
                alignSelf="flex-end"
              />
            </Stack>
            <Stack
              flex="1"
              pt={{ base: '', md: '4rem' }}
              pb={{ base: '', md: '4rem' }}
              pl={{ base: '', md: '4rem' }}
              align="flex-end"
              pr={{ base: '', md: '4rem' }}
            >
              <Image
                src="images/hero_image_mediay.png"
                alt="mediay-app"
                boxSize="90%"
              />
            </Stack>
          </Stack>
          <Stack overflow="hidden">
            <Image
              src="images/love_you_gesture.png"
              alt="love-you-gesture"
              boxSize="32%"
              objectFit="contain"
              alignSelf="flex-end"
              pos="absolute"
              right={{ base: '', md: '2rem' }}
              bottom={{ base: '', md: '-2rem' }}
            />
          </Stack>
        </Container>
      </chakra.section>

      <chakra.section>
        <Container
          maxW="100%"
          p="0"
          borderBottom="4px solid rgba(255, 255, 255, 0.04)"
        >
          <Stack
            justify="center"
            align="center"
            spacing={{ base: '', md: '-6rem' }}
          >
            <Stack direction="row" spacing={{ base: '', md: '12' }}>
              <Text
                fontSize={{ base: '', md: '100px' }}
                fontWeight="700"
                lineHeight={{ base: '', md: '136px' }}
                textTransform="uppercase"
              >
                Before
              </Text>
              <Text
                fontSize={{ base: '', md: '100px' }}
                fontWeight="700"
                lineHeight={{ base: '', md: '136px' }}
                textTransform="uppercase"
              >
                &
              </Text>
              <Text
                fontSize={{ base: '', md: '100px' }}
                fontWeight="700"
                lineHeight={{ base: '', md: '136px' }}
                color="#D2FC04"
                textTransform="uppercase"
              >
                After
              </Text>
            </Stack>
            <Heading
              color="#FA5B17"
              fontSize={{ base: '', md: '260px' }}
              fontWeight="700"
              lineHeight={{ base: '', md: '351px' }}
            >
              Mediay
            </Heading>
          </Stack>

          <Stack>
            <Image
              src="images/b_a.png"
              alt="Before and After Mediay"
              boxSize="100%"
              objectFit="contain"
            />
          </Stack>
        </Container>
      </chakra.section>

      <chakra.section>
        <Container maxW="100%" p="0">
          <Stack
            direction="row"
            align="center"
            spacing={{ base: '', md: '12' }}
          >
            <Heading
              fontStyle="normal"
              fontWeight="700"
              fontSize={{ base: '40px', md: '72px' }}
              whiteSpace="nowrap"
              color="#000"
              opacity="90%"
              lineHeight={{ base: '38px', md: '97px' }}
              textTransform="uppercase"
              css={{
                '-webkit-text-stroke': '1px white',
                'text-stroke': '2px white'
              }}
            >
              Join groups
            </Heading>
            <Heading
              fontStyle="normal"
              fontWeight="700"
              fontSize={{ base: '40px', md: '72px' }}
              whiteSpace="nowrap"
              lineHeight={{ base: '38px', md: '97px' }}
              textTransform="uppercase"
            >
              Copy credidentials
            </Heading>
            <Heading
              fontStyle="normal"
              fontWeight="700"
              fontSize={{ base: '40px', md: '72px' }}
              whiteSpace="nowrap"
              color="#000"
              opacity="90%"
              lineHeight={{ base: '38px', md: '97px' }}
              textTransform="uppercase"
              css={{
                '-webkit-text-stroke': '1px white',
                'text-stroke': '2px white'
              }}
            >
              Enjoy
            </Heading>
          </Stack>
          <Stack
            direction="row"
            align="center"
            spacing={{ base: '', md: '12' }}
          >
            <Heading
              fontStyle="normal"
              fontWeight="700"
              fontSize={{ base: '40px', md: '72px' }}
              whiteSpace="nowrap"
              color="#000"
              opacity="90%"
              lineHeight={{ base: '38px', md: '97px' }}
              textTransform="uppercase"
              css={{
                '-webkit-text-stroke': '1px white',
                'text-stroke': '2px white'
              }}
            >
              Invite friends
            </Heading>
            <Heading
              fontStyle="normal"
              fontWeight="700"
              fontSize={{ base: '40px', md: '72px' }}
              whiteSpace="nowrap"
              lineHeight={{ base: '38px', md: '97px' }}
              textTransform="uppercase"
            >
              Add subscribtions
            </Heading>
            <Heading
              fontStyle="normal"
              fontWeight="700"
              fontSize={{ base: '40px', md: '72px' }}
              whiteSpace="nowrap"
              color="#000"
              opacity="90%"
              lineHeight={{ base: '38px', md: '97px' }}
              textTransform="uppercase"
              css={{
                '-webkit-text-stroke': '1px white',
                'text-stroke': '2px white'
              }}
            >
              Share
            </Heading>
          </Stack>
        </Container>

        <chakra.aside h={{ base: '', md: '50vh' }}>
          <Stack align="center" justify="center" h="100%">
            <Button
              fontWeight="700"
              fontSize=" 32px"
              lineHeight=" 43px"
              textTransform="capitalize"
              bgColor="#E70808"
              color="rgba(255, 255, 255, 0.87)"
              size="lg"
              px={{ base: '', md: '10rem' }}
              py={{ base: '', md: '2.4rem' }}
              rounded="12px"
              alignSelf="center"
            >
              Join Now
            </Button>
          </Stack>
        </chakra.aside>
      </chakra.section>

      <chakra.footer bgColor="#7026EA">
        <Container
          maxW="100%"
          p="0"
          h="10vh"
          bgImage="url(/images/bg_footer.png)"
          bgRepeat="no-repeat"
          bgSize="100%"
          bgPos="center"
        >
          <Grid
            templateColumns={{ base: '', md: 'repeat(1, 1fr)' }}
            templateRows={{ base: '', md: 'repeat(1, 1fr)' }}
            rowGap={{ base: '', md: '1rem' }}
            overflow="hidden"
          >
            <Stack>
              <Grid templateColumns={{ base: '', md: 'repeat(3, 1fr)' }}>
                <Stack
                  justify="space-between"
                  h="100%"
                  align="left"
                  gridColumn="1 / 3"
                  // w="58%"
                  // pr={{ base: '', md: '8' }}
                >
                  <Text
                    fontSize={{ base: '', md: '68px' }}
                    fontWeight="700"
                    lineHeight={{ base: '', md: '68px' }}
                  >
                    In the future, everyone will be subscribed to a service for
                    convenience and FOMO.
                  </Text>
                  {/* <Image src="/logo.svg" alt="logo" boxSize="100px" p="4" /> */}
                </Stack>

                <Stack
                  justify="flex-start"
                  align="flex-end"
                  pt={{ base: '', md: '1rem' }}
                >
                  <Stack
                    transform="rotate(-90deg)"
                    spacing={{ base: '', md: '-2.8rem' }}
                  >
                    <Heading
                      as="h1"
                      fontStyle="normal"
                      fontWeight="700"
                      fontSize={{ base: '80px', md: '126px' }}
                      whiteSpace="nowrap"
                      lineHeight={{ base: '188px', md: '197px' }}
                      textTransform="uppercase"
                    >
                      Mediay
                    </Heading>
                    <Heading
                      as="h1"
                      fontStyle="normal"
                      fontWeight="700"
                      fontSize={{ base: '80px', md: '126px' }}
                      whiteSpace="nowrap"
                      color="transparent"
                      lineHeight={{ base: '188px', md: '110px' }}
                      textTransform="uppercase"
                      css={{
                        '-webkit-text-stroke': '2px white',
                        'text-stroke': '2px white'
                      }}
                    >
                      Mediay
                      <br /> Mediay
                      <br /> Mediay
                    </Heading>
                  </Stack>
                </Stack>
              </Grid>
            </Stack>

            <Stack
              overflow="hidden"
              w="100%"
              align="center"
              justify="flex-end"
              spacing="2"
              p={{ base: '', md: '24px' }}
            >
              <Stack direction="row">
                <StartButton
                  border="1px solid #D2FC04"
                  bg="transparent"
                  color="#D2FC04"
                />
                <StartButton bg="#D2FC04" color="#000" />
                <StartButton
                  border="1px solid #fff"
                  bg="transparent"
                  color="#fff"
                />
                <StartButton bg="#D2FC04" color="#000" />
                <StartButton bg="#D2FC04" color="#000" />
                <StartButton
                  border="1px solid #D2FC04"
                  bg="transparent"
                  color="#D2FC04"
                />
                <StartButton bg="#D2FC04" color="#000" />
                <StartButton bg="#D2FC04" color="#000" />
                <StartButton
                  border="1px solid #fff"
                  bg="transparent"
                  color="#fff"
                />
              </Stack>
              <Stack direction="row">
                <StartButton bg="#D2FC04" color="#000" />

                <StartButton
                  border="1px solid #EB72FF"
                  bg="transparent"
                  color="#EB72FF"
                />
                <StartButton
                  border="1px solid #fff"
                  bg="transparent"
                  color="#fff"
                />

                <StartButton
                  border="1px solid #D2FC04"
                  bg="transparent"
                  color="#D2FC04"
                />
                <StartButton bg="#D2FC04" color="#000" />
                <StartButton
                  border="1px solid #D2FC04"
                  bg="transparent"
                  color="#D2FC04"
                />

                <StartButton bg="#D2FC04" color="#000" />
                <StartButton
                  border="1px solid #EB72FF"
                  bg="transparent"
                  color="#EB72FF"
                />
                <StartButton bg="#D2FC04" color="#000" />

                <StartButton
                  border="1px solid #fff"
                  bg="transparent"
                  color="#fff"
                />
                <StartButton bg="#D2FC04" color="#000" />
                <StartButton
                  border="1px solid #D2FC04"
                  bg="transparent"
                  color="#D2FC04"
                />
              </Stack>
            </Stack>
          </Grid>
        </Container>
      </chakra.footer>
    </>
  )
}

export default Page
